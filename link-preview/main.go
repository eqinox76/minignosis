// Package codeprview provides a cloud function which
// observes firestore changes and will search for preview information if a new link is added
package linkpreview

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"regexp"
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

type MyData struct {
	Url  StringValue `json:"url"`
	Name StringValue `json:"name"`
}

// https://medium.com/swlh/rollbacks-and-infinite-loops-with-firestore-and-cloud-functions-in-golang-263aa76398da
type StringValue struct {
	Str string `json:"stringValue"`
}

// GOOGLE_CLOUD_PROJECT is automatically set by the Cloud Functions runtime.
var projectID = os.Getenv("GOOGLE_CLOUD_PROJECT")
var client *firestore.Client

var wordsRE = regexp.MustCompile(`\w+`)

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

func Main(ctx context.Context, e FirestoreEvent) error {

	j, _ := json.Marshal(e)
	log.Print(string(j))

	updates := applyIfChanged(ctx, e, "url", AddPreview)
	updates = append(updates, applyIfChanged(ctx, e, "name", AddSearch)...)

	if e.OldValue.CreateTime.IsZero() {
		updates = append(updates, firestore.Update{
			Path:  "added",
			Value: time.Now(),
		})
	}
	return update(ctx, e, updates)
}

// applies applyfunc if the document is new or path has changed
func applyIfChanged(ctx context.Context, e FirestoreEvent, path string, applyfunc func(context.Context, FirestoreEvent) []firestore.Update) []firestore.Update {
	var nullTime time.Time

	if e.Value.CreateTime == nullTime {
		// deletion
		return nil
	}

	if e.OldValue.CreateTime == nullTime {
		// new document. Check if the path exists
		return applyfunc(ctx, e)
	}

	// this was an update check if an interessting field was updated
	for _, v := range e.UpdateMask.FieldPaths {
		if v == path {
			return applyfunc(ctx, e)
		}
	}
	return nil
}

// AddPreview is triggered by a change to a Firestore document. It updates
// the `original` value of the document to upper case.
func AddPreview(ctx context.Context, e FirestoreEvent) []firestore.Update {
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

	return []firestore.Update{
		{Path: "name", Value: info.Title},
		{Path: "description", Value: info.Description},
		{Path: "imageUrl", Value: extractImage(info)},
	}
}

func AddSearch(ctx context.Context, e FirestoreEvent) []firestore.Update {
	var sanitized []string
	for _, elem := range wordsRE.FindAllString(e.Value.Fields.Name.Str, -1) {
		if len(elem) >= 3 {
			sanitized = append(sanitized, strings.ToLower(elem))
		}
	}

	return []firestore.Update{
		{Path: "search", Value: sanitized},
	}
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

func update(ctx context.Context, e FirestoreEvent, data []firestore.Update) error {
	fullPath := strings.Split(e.Value.Name, "/documents/")[1]
	pathParts := strings.Split(fullPath, "/")
	collection := pathParts[0]
	doc := strings.Join(pathParts[1:], "/")

	_, err := client.Collection(collection).Doc(doc).Update(ctx, data)

	if err != nil {
		return fmt.Errorf("client.Collection: %v", err)
	}
	return nil
}
