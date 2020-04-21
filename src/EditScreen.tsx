import React from "react";
import { RouteComponentProps } from 'react-router-dom';
import { AppBar, Grid, IconButton, TextField, Toolbar, Typography } from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import LogoutButton from './Logout';
import Fab from '@material-ui/core/Fab';
import { firestore } from "firebase";


export default class EditScreen extends React.Component<RouteComponentProps<any>> {
  render() {
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
            <TextField id="name" label="Name"/>
          </Grid>
          <Grid item>
            <TextField id="url" label="URL" defaultValue={this.props.match.params.id}/>
          </Grid>
        </Grid>
        <Fab onClick={() => {
          firestore().collection("entries").doc(this.props.match.params.id).delete().then(() => {
            this.props.history.push("/")
          })
        }}>
          <DeleteForeverIcon/>
        </Fab>
      </div>
    )
  }
}
