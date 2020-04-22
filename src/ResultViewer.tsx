import React, { Component } from "react";
import { List, ListItem, ListItemText } from "@material-ui/core";
import LinkOutlinedIcon from '@material-ui/icons/LinkOutlined';
import { firestore } from "firebase";
import { Entry } from "./Firestore";

class ResultViewerState {
  constructor(
    public entries: Array<firestore.QueryDocumentSnapshot> = []
  ) {
  }
}

// TODO https://github.com/bvaughn/react-window#can-i-lazy-load-data-for-my-list
export class ResultViewer extends Component<{}, ResultViewerState> {

  componentDidMount(): void {
    firestore()
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
          const entry = Entry.fromFirestore(ref);
          return (
            <ListItem button key={ref.id}>
              <ListItemText primary={
                <div>
                  {entry.url}

                </div>
              }/>
              <a href={entry.url}><LinkOutlinedIcon/></a>
            </ListItem>
          );
        })}
      </List>
    );
  }

}
