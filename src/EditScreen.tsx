import React from "react";
import { AppBar, Grid, IconButton, TextField, Toolbar, Typography } from "@material-ui/core";
import HomeIcon from "@material-ui/icons/Home";
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import SaveIcon from '@material-ui/icons/Save';
import Fab from '@material-ui/core/Fab';
import { Entry } from "./Firestore";
import { TagField } from "./TagField";
import { AuthButton } from './Auth';
import { useNavigate, useParams } from "react-router-dom";
import { collection, deleteDoc, doc, DocumentReference, getDoc, getFirestore, setDoc } from "firebase/firestore";


class State {
  doc: Entry;
  ref: DocumentReference;
  changed: boolean = false;
}

export default class EditScreen extends React.Component<Readonly<any>, State> {
  constructor(props: any) {
    super(props);

    const { id } = useParams();
    // start loading data
    const ref = doc(collection(getFirestore(), "entries"), id)
    getDoc(ref).then((e) => this.setState({ doc: Entry.fromFirestore(e), ref: ref }))
  }

  save = async () => {
    if (!this.state.changed) {
      return
    }

    await setDoc(this.state.ref, this.state.doc.toFirestore())
    this.setState({ changed: false })
  }

  render() {
    const navigate = useNavigate()
    if (this.state == null) {
      return <div>
        <AppBar position="static">
          <Toolbar>
            <IconButton edge="start" color="inherit" aria-label="menu" onClick={() => {
              navigate("/");
            }}>
              <HomeIcon />
            </IconButton>
            <Typography variant="h6">
              Edit
            </Typography>
            <div style={{ flexGrow: 1 }} />
            <AuthButton />
          </Toolbar>
        </AppBar>
      </div>
    }

    return (
      <div>
        <AppBar position="static">
          <Toolbar>
            <IconButton edge="start" color="inherit" aria-label="menu" onClick={() => {
              navigate("/");
            }}>
              <HomeIcon />
            </IconButton>
            <Typography variant="h6">
              Edit
            </Typography>
            <div style={{ flexGrow: 1 }} />
            <AuthButton />
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
                this.setState({ changed: true, doc: doc });
              }} />
          </Grid>
          <Grid item>
            <TextField id="url"
              label="URL"
              defaultValue={this.state.doc.url}
              onChange={(e) => {
                let doc = this.state.doc;
                doc.url = e.target.value;
                this.setState({ changed: true, doc: doc });
              }} />
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
                this.setState({ changed: true, doc: this.state.doc });
              }}
              onDelete={(tag) => {
                this.state.doc.tags = this.state.doc.tags.filter((e) => e != tag);
                this.setState({ changed: true, doc: this.state.doc });
              }} />
          </Grid>
        </Grid>
        <Fab onClick={this.save} disabled={!this.state.changed}>
          <SaveIcon />
        </Fab>
        <Fab onClick={async () => {
          await deleteDoc(doc(collection(getFirestore(), "entries"), this.props.match.params.id))
          navigate("/");
        }}>
          <DeleteForeverIcon />
        </Fab>
      </div>
    )
  }
}
