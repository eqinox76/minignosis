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
      .limit(30)
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
        {this.state.entries.map((e) => {
          return <ResultItem doc={e}/>
        })}
      </List>
    );
  }
}

class ResultItemState {

}

class ResultItem extends Component<{
  doc: firestore.QueryDocumentSnapshot
}, ResultItemState> {
  private entry: Entry;

  render() {
    this.entry = Entry.fromFirestore(this.props.doc);
    return (
      // TODO https://www.npmjs.com/package/open-graph-scraper
      <ListItem button key={this.props.doc.id}>
        <ListItemText
          primary={this.entry.name ?? this.entry.url}
        />
        <a href={this.entry.url}><LinkOutlinedIcon/></a>
      </ListItem>
    )
  }
}
