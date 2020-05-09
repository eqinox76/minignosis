// Package codeprview provides a cloud function which
// observes firestore changes and will search for preview information if a new link is added
package linkpreview

import (
	"context"
	"log"
	"net/http"
	"os"
	"strings"
	"time"

	"cloud.google.com/go/firestore"
	firebase "firebase.google.com/go"

	"github.com/dyatlov/go-htmlinfo/htmlinfo"
)

// FirestoreEvent is the payload of a Firestore event.
type FirestoreEvent struct {
	OldValue   FirestoreValue `json:"oldValue"`
	Value      FirestoreValue `json:"value"`
	UpdateMask struct {
		FieldPaths []string `json:"fieldPaths"`
	} `json:"updateMask"`
}

// FirestoreValue holds Firestore fields.
type FirestoreValue struct {
	CreateTime time.Time `json:"createTime"`
	// Fields is the data for this value. The type depends on the format of your
	// database. Log an interface{} value and inspect the result to see a JSON
	// representation of your database fields.
	Fields     MyData    `json:"fields"`
	Name       string    `json:"name"`
	UpdateTime time.Time `json:"updateTime"`
}

// we are only interessted in reading the url
type MyData struct {
	Url StringValue `json:"url"`
}

// https://medium.com/swlh/rollbacks-and-infinite-loops-with-firestore-and-cloud-functions-in-golang-263aa76398da
type StringValue struct {
	Str string `json:"stringValue"`
}

// GOOGLE_CLOUD_PROJECT is automatically set by the Cloud Functions runtime.
var projectID = os.Getenv("GOOGLE_CLOUD_PROJECT")

// client is a Firestore client, reused between function invocations.
var client *firestore.Client

func init() {
	// Use the application default credentials.
	conf := &firebase.Config{ProjectID: projectID}

	// Use context.Background() because the app/client should persist across
	// invocations.
	ctx := context.Background()

	app, err := firebase.NewApp(ctx, conf)
	if err != nil {
		log.Fatalf("firebase.NewApp: %v", err)
	}

	client, err = app.Firestore(ctx)
	if err != nil {
		log.Fatalf("app.Firestore: %v", err)
	}
}

// AddPreview is triggered by a change to a Firestore document. It updates
// the `original` value of the document to upper case.
func AddPreview(ctx context.Context, e FirestoreEvent) error {
	var nullTime time.Time

	// j, _ := json.Marshal(e)
	// log.Printf(string(j))

	if e.OldValue.CreateTime != nullTime {
		// this is an update or deletion.
		return nil
	}

	url := e.Value.Fields.Url.Str

	resp, err := http.Get(url)
	if err != nil {
		log.Fatalf("http.Get '%s': %v", url, err)
	}
	defer resp.Body.Close()

	info := htmlinfo.NewHTMLInfo()

	err = info.Parse(resp.Body, &url, nil)
	if err != nil {
		log.Fatalf("info.Parse: %v", err)
	}

	fullPath := strings.Split(e.Value.Name, "/documents/")[1]
	pathParts := strings.Split(fullPath, "/")
	collection := pathParts[0]
	doc := strings.Join(pathParts[1:], "/")

	data := []firestore.Update{
		{Path: "name", Value: info.Title},
		{Path: "description", Value: info.Description},
		{Path: "imageUrl", Value: extractImage(info)},
	}
	_, err = client.Collection(collection).Doc(doc).Update(ctx, data)

	if err != nil {
		log.Fatalf("client.Collection: %v", err)
	}

	return nil
}

func extractImage(info *htmlinfo.HTMLInfo) string {
	if info.ImageSrcURL != "" {
		return info.ImageSrcURL
	}

	if len(info.OGInfo.Images) > 0 {
		if info.OGInfo.Images[0].URL != "" {
			return info.OGInfo.Images[0].URL
		}
		if info.OGInfo.Images[0].SecureURL != "" {
			return info.OGInfo.Images[0].SecureURL
		}
	}

	if info.OembedInfo.ThumbnailURL != "" {
		return info.OembedInfo.ThumbnailURL
	}

	return ""
}
