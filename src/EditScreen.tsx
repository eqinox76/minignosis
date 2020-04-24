import React from "react";
import { RouteComponentProps } from 'react-router-dom';
import { AppBar, Grid, IconButton, TextField, Toolbar, Typography } from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import LogoutButton from './Logout';
import SaveIcon from '@material-ui/icons/Save';
import Fab from '@material-ui/core/Fab';
import { Entry, EntryCollection } from "./Firestore";
import { firestore } from "firebase";
import { TagField } from "./TagField";

class State {
  doc: Entry;
  ref: firestore.DocumentReference;
  changed: boolean = false;
}

export default class EditScreen extends React.Component<RouteComponentProps<any>, State> {
  constructor(props: any) {
    super(props);

    // start loading data
    const ref = EntryCollection.doc(this.props.match.params.id)
    ref.get()
      .then((e) => this.setState({doc: Entry.fromFirestore(e), ref: ref}))

    this.save = this.save.bind(this)
  }

  save() {
    if (!this.state.changed) {
      return
    }

    this.state.ref
      .set(this.state.doc.toFirestore())
      .then(() => this.setState({changed: false}))
  }

  render() {
    if (this.state == null) {
      return <div>
        <AppBar position="static">
          <Toolbar>
            <IconButton edge="start" color="inherit" aria-label="menu" onClick={() => {
              this.props.history.push("/");
            }}>
              <MenuIcon/>
            </IconButton>
            <Typography variant="h6">
              Edit
            </Typography>
            <div style={{flexGrow: 1}}/>
            <LogoutButton/>
          </Toolbar>
        </AppBar>
      </div>
    }

    return (
      <div>
        <AppBar position="static">
          <Toolbar>
            <IconButton edge="start" color="inherit" aria-label="menu" onClick={() => {
              this.props.history.push("/");
            }}>
              <MenuIcon/>
            </IconButton>
            <Typography variant="h6">
              Edit
            </Typography>
            <div style={{flexGrow: 1}}/>
            <LogoutButton/>
          </Toolbar>
        </AppBar>
        <Grid container spacing={2}>
          <Grid item>
            <TextField id="name"
                       label="Name"
                       defaultValue={this.state.doc.name}
                       onChange={(e) => {
                         let doc = this.state.doc;
                         doc.name = e.target.value;
                         this.setState({changed: true, doc: doc});
                       }}/>
          </Grid>
          <Grid item>
            <TextField id="url"
                       label="URL"
                       defaultValue={this.state.doc.url}
                       onChange={(e) => {
                         let doc = this.state.doc;
                         doc.url = e.target.value;
                         this.setState({changed: true, doc: doc});
                       }}/>
          </Grid>
          <Grid item>
            <TagField tags={this.state.doc.tags}
                      onAdd={(tag) => {
                        if (this.state.doc.tags === undefined) {
                          this.state.doc.tags = []
                        }
                        if (this.state.doc.tags.indexOf(tag) !== -1) {
                          return
                        }
                        this.state.doc.tags.push(tag);
                        this.setState({changed: true, doc: this.state.doc});
                      }}
                      onDelete={(tag) => {
                        this.state.doc.tags = this.state.doc.tags.filter((e) => e != tag);
                        this.setState({changed: true, doc: this.state.doc});
                      }}/>
          </Grid>
        </Grid>
        <Fab onClick={this.save} disabled={!this.state.changed}>
          <SaveIcon/>
        </Fab>
        <Fab onClick={() => {
          EntryCollection.doc(this.props.match.params.id).delete().then(() => {
            this.props.history.push("/")
          })
        }}>
          <DeleteForeverIcon/>
        </Fab>
      </div>
    )
  }
}
