import * as React from "react"
import { AppBar, IconButton, TextField, Toolbar, Typography } from "@material-ui/core";
import MenuIcon from '@material-ui/icons/Menu';
import LogoutButton from './Logout';
import { ResultViewer } from './ResultViewer';
import { AddField } from './AddField';
import EditScreen from './EditScreen';
import { BrowserRouter as Router, Route, RouteComponentProps, Switch } from 'react-router-dom';
import { auth } from "firebase";
import { Entry, EntryCollection } from "./Firestore";

class Adder extends React.Component<RouteComponentProps<any>> {
  componentDidMount(): void {
    let decoded = decodeURIComponent(this.props.match.params.url);
    if (!decoded.includes("http")) {
      decoded = "https://" + decoded
    }
    const entry = new Entry(decoded);
    EntryCollection.where("url", "==", entry.url).limit(1).get().then(
      result => {
        if (result.empty) {
          EntryCollection
            .add(entry.toFirestore())
            .then(doc => this.props.history.push("/edit/" + doc.id))
        } else {
          this.props.history.push("/edit/" + result.docs[0].id)
        }
      }
    )
  }

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
              Adding {this.props.match.params.url}
            </Typography>
            <div style={{flexGrow: 1}}/>
            <LogoutButton/>
          </Toolbar>
        </AppBar>
      </div>
    )
  }
}

export function App() {
  let provider = new auth.GoogleAuthProvider();
  auth().getRedirectResult().then(function (result) {
    if (result.user) {
      console.log(`user logged in ${result.user.email}`);
    } else if (auth().currentUser) {
      console.log(`already logged in user: ${auth().currentUser.email}`);
    } else {
      auth().signInWithRedirect(provider);
    }
  });

  return (
    <Router>
      <Switch>
        <Route path="/edit/:id" component={EditScreen}/>
        <Route path="/add/:url" component={Adder}/>
        <Route path="/">
          <div>
            <AppBar position="static">
              <Toolbar>
                <IconButton edge="start" color="inherit" aria-label="menu">
                  <MenuIcon/>
                </IconButton>
                <TextField id="outlined-basic" label="Search" variant="outlined"/>
                <AddField/>
                <div style={{flexGrow: 1}}/>
                <LogoutButton/>
              </Toolbar>
            </AppBar>
            <ResultViewer/>
          </div>
        </Route>
      </Switch>
    </Router>);
}
