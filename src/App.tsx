import * as React from "react"
import { Button, List, ListItem, ListItemText } from "@material-ui/core";
import firebase from "firebase";

export function App() {
  let provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().getRedirectResult().then(function (result) {
    if (result.user) {
      console.log(`user logged in ${result.user}`);
    } else if (firebase.auth().currentUser) {
      console.log(`already logged in user: ${firebase.auth().currentUser.email}`);
    } else {
      firebase.auth().signInWithRedirect(provider);
    }
  });

  return (
    <div>
      <Button variant="contained" color="primary">
        Hello World!!
      </Button>
      <List component="nav" aria-label="secondary mailbox folders">
        <ListItem button>
          <ListItemText primary="Trash"/>
        </ListItem>
        <ListItem>
          <ListItemText primary="Spam"/>
        </ListItem>
      </List>
    </div>);
}
