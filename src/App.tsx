import * as React from "react"
import { AppBar, Button, IconButton, List, ListItem, ListItemText, Toolbar } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import PersonOutlineIcon from '@material-ui/icons/PersonOutline';
import firebase from "firebase";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
  }),
);

function logout() {
  firebase.auth().signOut().then(function () {
    window.location.reload();
  }, function (error) {
    console.log(error);
  });
}

export function App() {
  let provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().getRedirectResult().then(function (result) {
    if (result.user) {
      console.log(`user logged in ${result.user.email}`);
    } else if (firebase.auth().currentUser) {
      console.log(`already logged in user: ${firebase.auth().currentUser.email}`);
    } else {
      firebase.auth().signInWithRedirect(provider);
    }
  });

  const classes = useStyles();
  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu">
            <MenuIcon/>
          </IconButton>
          <div className={classes.title}>
            MiniGnosis
          </div>
          <IconButton color="inherit" aria-label="sign out" onClick={logout}>
            <PersonOutlineIcon/>
          </IconButton>
        </Toolbar>
      </AppBar>
      <Button variant="contained" color="primary">
        Hello World!!
      </Button>
      <List component="nav" aria-label="secondary mailbox folders">
        <ListItem button>
          <ListItemText primary="Trash"/>
        </ListItem>
        <ListItem>
          <ListItemText primary="Spam"/>
        </ListItem>
      </List>
    </div>);
}
