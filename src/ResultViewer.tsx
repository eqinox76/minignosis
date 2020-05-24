import React, { Component } from "react";
import { Chip, List, ListItem, ListItemText } from "@material-ui/core";
import LinkOutlinedIcon from '@material-ui/icons/LinkOutlined';
import Grid from "@material-ui/core/Grid";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import { firestore } from "firebase";
import { Entry } from "./Firestore";
import { RouteComponentProps, withRouter } from "react-router-dom";

class ResultViewerState {
  constructor(
    public entries: Array<firestore.QueryDocumentSnapshot> = [],
    public lastSearchTerm: String,
  ) {
  }
}

class ResultViewerProps {
  search: String
}

// TODO https://github.com/bvaughn/react-window#can-i-lazy-load-data-for-my-list
export class ResultViewer extends Component<ResultViewerProps, ResultViewerState> {

  componentDidMount(): void {
    this.maybeUpdate()
  }

  componentDidUpdate(): void {
    this.maybeUpdate()
  }

  maybeUpdate() {
    if (this.state !== null && this.state.lastSearchTerm == this.props.search) {
      // no new search necessary
      return
    }

    let request = firestore()
      .collection("entries")
      .limit(30)

    if (this.props.search.length != 0) {
      let searchTerms = this.props.search.match(/\w+/g).map((token: String) => {
        return token.toLowerCase()
      })

      request = request.where('search', 'array-contains-any', searchTerms)
    }

    request.onSnapshot(snap => {
      this.setState({ entries: snap.docs, lastSearchTerm: this.props.search })
    })
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
      <Grid container spacing={4}>
        {this.state.entries.map((e) => {
          return <ResultItemWithRouter doc={e} key={e.id} />
        })}
      </Grid>
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
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <Card style={{ height: "100%" }}
          onClick={() => this.props.history.push("/edit/" + this.props.doc.id)}>
          <CardMedia component="img"
            image={this.entry.imageUrl}
          />
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
      </Grid>
    )
  }
}

const ResultItemWithRouter = withRouter(ResultItem);
