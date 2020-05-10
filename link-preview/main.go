// Package codeprview provides a cloud function which
// observes firestore changes and will search for preview information if a new link is added
package linkpreview

import (
	"context"
	"log"
	"net/http"
	"os"
	"strings"
	"encoding/json"
	"time"
	"regexp"

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
	Url StringValue `json:"url"`
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

func Main(ctx context.Context, e FirestoreEvent) error{
	
	j, _ := json.Marshal(e)
	log.Printf(string(j))
	
	applyIfChanged(ctx, e, "url", AddPreview)
	applyIfChanged(ctx, e, "name", AddSearch)
	return nil
}

// applies applyfunc if the document is new or path has changed
func applyIfChanged(ctx context.Context,e FirestoreEvent, path string, applyfunc func(context.Context, FirestoreEvent)){
	var nullTime time.Time

	if e.Value.CreateTime == nullTime {
		// deletion
		return
	}

	if e.OldValue.CreateTime == nullTime {
		// new document. Check if the path exists
		applyfunc(ctx, e)
		return
	}

	// this was an update check if an interessting field was updated
	for _, v := range e.UpdateMask.FieldPaths{
		if v == path {
			applyfunc(ctx, e)
			return
		}
	}
}

// AddPreview is triggered by a change to a Firestore document. It updates
// the `original` value of the document to upper case.
func AddPreview(ctx context.Context, e FirestoreEvent) {
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

	data := []firestore.Update{
		{Path: "name", Value: info.Title},
		{Path: "description", Value: info.Description},
		{Path: "imageUrl", Value: extractImage(info)},
	}
	update(ctx, e, data)
}


func AddSearch(ctx context.Context, e FirestoreEvent) {
	var sanitized []string
	for _, elem := range wordsRE.FindAllString(e.Value.Fields.Name.Str, -1){
		if len(elem) >= 3 {
			sanitized = append(sanitized, strings.ToLower(elem))
		}
	}

	data := []firestore.Update{
		{Path: "search", Value: sanitized},
	}
	update(ctx, e, data)
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

func update (ctx context.Context, e FirestoreEvent, data []firestore.Update){
	fullPath := strings.Split(e.Value.Name, "/documents/")[1]
	pathParts := strings.Split(fullPath, "/")
	collection := pathParts[0]
	doc := strings.Join(pathParts[1:], "/")

	_, err := client.Collection(collection).Doc(doc).Update(ctx, data)

	if err != nil {
		log.Fatalf("client.Collection: %v", err)
	}
}
