import React, { Component } from "react";
import { Fab, Grid, IconButton, TextField } from "@material-ui/core";
import AddIcon from '@material-ui/icons/Add';

class InputFormState {
  active: boolean
}


export class InputForm extends Component<{}, InputFormState> {
  render() {
    if (this.state === null || !this.state.active) {
      return (
        <Fab color="secondary" aria-label="edit" onClick={() => {
          this.setState({active: true})
        }}>
          <AddIcon/>
        </Fab>
      );
    } else {
      return (
        <Grid container spacing={2} justify="center">
          <Grid item>
            <TextField id="url" label="URL" onKeyPress={this.key}/>
          </Grid>
          <Grid item>
            <TextField id="name" label="Name"/>
          </Grid>
          <Grid>
            <IconButton>
              <AddIcon/>
            </IconButton>
          </Grid>
        </Grid>
      );
    }
  }


  private key(e: KeyboardEvent) {
    if (e.key === "Enter"){
      this.submitted()
    }
  }

  private submitted() {
    //TODO read state and send to firestore
  }
}
