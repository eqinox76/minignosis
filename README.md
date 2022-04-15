# minignosis

A new Flutter project.

## Getting Started

This project is a starting point for a Flutter application.

A few resources to get you started if this is your first Flutter project:

- [Lab: Write your first Flutter app](https://flutter.dev/docs/get-started/codelab)
- [Cookbook: Useful Flutter samples](https://flutter.dev/docs/cookbook)

For help getting started with Flutter, view our
[online documentation](https://flutter.dev/docs), which offers tutorials,
samples, guidance on mobile development, and a full API reference.
```
flutter run -d chrome
```


# Deployment

## functions


```
cd link-preview
gcloud functions deploy linkpreview \
  --runtime go113 \
  --memory 128MB \
  --region europe-west3 \
  --entry-point Main \
  --trigger-event "providers/cloud.firestore/eventTypes/document.write" \
  --trigger-resource "projects/YOUR_PROJECT_ID/databases/(default)/documents/entries/{id}"
```