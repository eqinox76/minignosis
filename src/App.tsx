import * as React from "react"
import { AppBar, IconButton, TextField, Toolbar } from "@material-ui/core";
import MenuIcon from '@material-ui/icons/Menu';
import PersonOutlineIcon from '@material-ui/icons/PersonOutline';
import { ResultViewer } from './ResultViewer';
import { AddField } from './AddField';
import AddScreen from './AddScreen';
import firebase from "firebase";
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

function logout() {
  firebase.auth().signOut().then(function () {
    window.location.reload();
  }, function (error) {
    console.log(error);
  });
}

function getAppBar() {
  return <AppBar position="static">
    <Toolbar>
      <IconButton edge="start" color="inherit" aria-label="menu">
        <MenuIcon/>
      </IconButton>
      <TextField id="outlined-basic" label="Search" variant="outlined"/>
      <AddField/>
      <div style={{flexGrow: 1}}/>
      <IconButton color="inherit" aria-label="sign out" onClick={logout}>
        <PersonOutlineIcon/>
      </IconButton>
    </Toolbar>
  </AppBar>;
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


  return (
    <Router>
      <Switch>
        <Route path="/add/:url" component={AddScreen}/>
        <Route path="/">
          <div>
            {getAppBar()}

            {/*https://github.com/bvaughn/react-window#can-i-lazy-load-data-for-my-list*/}

            <ResultViewer/>
          </div>
        </Route>
      </Switch>
    </Router>);
}
