import React, { Component } from "react";
import { Grid, IconButton, TextField } from "@material-ui/core";
import AddIcon from '@material-ui/icons/Add';

export class AddField extends Component {
  private urlField: string;

  constructor(props: any) {
    super(props);
    this.keyPress = this.keyPress.bind(this)
    this.submitted = this.submitted.bind(this)
  }

  render() {
    return (
      <Grid container spacing={2} justify="center">
        <Grid item>
          <TextField
            id="url"
            label="Add"
            variant="outlined"
            onChange={(e) => this.urlField = e.target.value}
            onKeyDown={this.keyPress}/>
        </Grid>
        <Grid item>
          <IconButton>
            <AddIcon onClick={this.submitted}/>
          </IconButton>
        </Grid>
      </Grid>
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
    if (!this.urlField) {
      return
    }
    // update
    console.log(this.urlField);
    this.setState({active: false});
  }
}
