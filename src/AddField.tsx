import React, { Component } from "react";
import { TextField } from "@material-ui/core";
import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import { Navigate } from 'react-router-dom';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
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
