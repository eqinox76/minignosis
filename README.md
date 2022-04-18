# MiniGnosis

Playground project for React + Firebase.

This project aims to produce a website to collect and find knowledge. Mainly in form of links.
It focuses on an easy way to add new links and automatic indexing.
It will allow retrievial of those links via a search and a content tree.  

This project depends heavily on [GCP](https://cloud.google.com) services:
* firebase hosting, auth
* firestore
* cloud functions
* cloud build

# Development

Let webpack watch and recompile the project
```
npm start
```
In parallel a local firebase hosting server can be started:
```
firebase serve
```