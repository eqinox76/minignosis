import React, { Component } from "react";
import { TextField } from "@mui/material";
import Button from '@mui/material/Button';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import { Navigate } from 'react-router-dom';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { UserContext, authorized } from "./Auth";

class State {
  url: string
  expanded: boolean
}

export class AddField extends Component<{}, State> {
  static contextType = UserContext
  private linkField: string;

  constructor(props: any) {
    super(props);
    this.keyPress = this.keyPress.bind(this);
    this.submitted = this.submitted.bind(this);
  }

  render() {
    if (this.state != null && this.state.url !== undefined) {
      return <Navigate to={'/add/' + this.state.url} />
    }
    return (
      <div>
        <Fab color="primary"
          disabled={!authorized}
          style={{
            margin: 0,
            top: 'auto',
            right: 20,
            bottom: 20,
            left: 'auto',
            position: 'fixed'
          }}
          onClick={() => { this.setState({ expanded: true }) }}>
          <AddIcon />
        </Fab>
        <Dialog open={this.state != null && this.state.expanded} onClose={() => { this.setState({ expanded: false }) }}>
          <DialogTitle>Add</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please urls article to be added.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              label="Add"
              fullWidth
              onChange={(e) => this.linkField = encodeURIComponent(e.target.value)}
              onKeyDown={this.keyPress} />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => { this.setState({ expanded: false }) }} color="primary">
              Cancel
            </Button>
            <Button onClick={this.submitted} color="primary">
              Add
            </Button>
          </DialogActions>
        </Dialog>
      </div >
    );
  }

  // TODO type this parameter. It seems to be 'KeyboardEvent<HTMLDivElement>' but that causes TS2315: Type 'KeyboardEvent' is not generic.
  private keyPress(event: any) {
    if (event.key === "Enter") {
      this.submitted();
    }
  }

  private submitted() {
    // validate
    if (!this.linkField) {
      return
    }
    // update
    this.setState({ url: this.linkField })
  }
}
