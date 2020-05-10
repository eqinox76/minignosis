import React, { Component } from "react";
import { Chip, List, ListItem, ListItemText } from "@material-ui/core";
import LinkOutlinedIcon from '@material-ui/icons/LinkOutlined';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import { firestore } from "firebase";
import { Entry } from "./Firestore";
import { RouteComponentProps, withRouter } from "react-router-dom";

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
        this.setState({ entries: snap.docs })
      }
      )
  }

  render() {
    if (this.state === null) {
      return (
        <List component="nav">
          <ListItem button key={4}>
            <ListItemText primary="Loading..." />
          </ListItem>
        </List>);
    }
    return (
      <List component="nav">
        {this.state.entries.map((e) => {
          return <ResultItemWithRouter doc={e} key={e.id} />
        })}
      </List>
    );
  }
}

class ResultItemProp {
  public doc: firestore.QueryDocumentSnapshot
}

class ResultItemState {

}

class ResultItem extends Component<RouteComponentProps<any> & ResultItemProp, ResultItemState> {
  private entry: Entry;

  render() {
    this.entry = Entry.fromFirestore(this.props.doc);
    return (
      // TODO https://www.npmjs.com/package/open-graph-scraper
      <ListItem button onClick={() => this.props.history.push("/edit/" + this.props.doc.id)}>
        <Card>
          <CardMedia style={{ height: 50, width: 30 }}>
            <img src={this.entry.imageUrl} />
          </CardMedia>
          <CardContent>
            <Typography variant="body2" color="textSecondary" component="p">
              {this.entry.name ?? this.entry.url}
            </Typography>
            <ul>
              {this.entry.tags?.map((tag: string) => <Chip key={tag} size="small" label={tag} />)}
            </ul>
            <a href={this.entry.url}>
              <LinkOutlinedIcon />
            </a>
          </CardContent>
        </Card>
      </ListItem >
    )
  }
}

const ResultItemWithRouter = withRouter(ResultItem);
