import React, { Component } from "react";
import { Chip, IconButton, List, ListItem, ListItemText } from "@mui/material";
import LinkOutlinedIcon from '@mui/icons-material/LinkOutlined';
import EditIcon from '@mui/icons-material/Edit';
import CachedIcon from '@mui/icons-material/Cached';
import Grid from "@mui/material/Grid";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Entry } from "./Firestore";
import { useNavigate } from "react-router-dom";
import * as _ from "lodash";
import { UserContext, authorized } from "./Auth";
import { collection, getFirestore, limit, onSnapshot, orderBy, query, where, QueryDocumentSnapshot } from "firebase/firestore";

class ResultViewerState {
  constructor(
    public entries: Array<QueryDocumentSnapshot> = [],
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

    let constrains = [orderBy("added", "desc"), limit(50)]

    if (this.props.search.length != 0) {
      let searchTerms = this.props.search.match(/\w+/g).map((token: String) => {
        return token.toLowerCase()
      })

      constrains.push(where('search', 'array-contains-any', searchTerms))
    }

    onSnapshot(query(collection(getFirestore(), "entries"), ...constrains), (snap: any) => {
      var docs = snap.docs;
      if (this.props.search.length > 0) {
        let tokens = this.props.search.match(/\w+/g)
        // stable sorting
        docs = _.sortBy(snap.docs, (d: QueryDocumentSnapshot) => {
          let entry = Entry.fromFirestore(d)
          return entry.search.filter(element => tokens.includes(element)).length
        }).reverse()
      }
      this.setState({ entries: docs, lastSearchTerm: this.props.search })
    })
  }

  render() {
    return this.state === null ?
      (
        <List component="nav">
          <ListItem button key={4}>
            <ListItemText primary="Loading..." />
          </ListItem>
        </List>)
      : (
        <Grid container
          spacing={2}
          xs={12}>
          {this.state.entries.map((e) => {
            return <ResultItem doc={e} key={e.id} />
          })}
        </Grid>
      );
  }
}

class ResultItemProp {
  public doc: QueryDocumentSnapshot
}

const ResultItem: React.FunctionComponent<ResultItemProp> = (props) => {

  const entry = Entry.fromFirestore(props.doc);
  return (
    <Grid item xs={12} sm={6} md={3} lg={2} xl={2}>
      <Card style={{ height: "100%" }}>
        <CardMedia component="img"
          image={entry.imageUrl}
        />
        <CardContent>
          <Typography variant="body2" color="textSecondary" component="p">
            {entry.name ?? entry.url}
          </Typography>
          <ul>
            {entry.tags?.map((tag: string) => <Chip key={tag} size="small" label={tag} />)}
          </ul>
          <a href={entry.url}>
            <LinkOutlinedIcon />
          </a>
          {authorized && <IconButton >
            <EditIcon onClick={() => {
              let navigate = useNavigate();
              navigate("/edit/" + props.doc.id);
            }} />
          </IconButton>}
          {authorized && <IconButton>
            <CachedIcon />
          </IconButton>}
        </CardContent>
      </Card>
    </Grid >
  )
}