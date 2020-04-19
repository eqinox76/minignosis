import React, { Component } from "react";
import { List, ListItem, ListItemText } from "@material-ui/core";
import firebase, { firestore } from "firebase";

class ResultViewerState {
  constructor(
    public entries: Array<firestore.QueryDocumentSnapshot> = []
  ) {
  }
}

export class ResultViewer extends Component<{}, ResultViewerState> {

  componentDidMount(): void {
    let coll = firebase.firestore()
      .collection("entries")
      .onSnapshot(snap => {
          this.setState({entries: snap.docs})
        }
      )
  }


  render() {
    if (this.state === null) {
      return (
        <List component="nav">
          <ListItem button>
            <ListItemText primary="Loading..."/>
          </ListItem>
        </List>);
    }
    return (
      <List component="nav">
        {this.state.entries.map(function (ref: firestore.QueryDocumentSnapshot) {
          return (
            <ListItem button key={ref.id}>
              <ListItemText primary={<a href={ref.get("url")}>{ref.get("url")}</a>}/>
            </ListItem>
          );
        })}
      </List>
    );
  }

}
