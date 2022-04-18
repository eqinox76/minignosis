import React, { FunctionComponent, ReactElement, useEffect, useState } from 'react';
import { AppBar, IconButton, TextField, Toolbar, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import HomeIcon from '@mui/icons-material/Home';
import { ResultViewer } from './ResultViewer';
import { AddField } from './AddField';
import EditScreen from './EditScreen';
import { BrowserRouter as Router, Route, Routes, useNavigate, useParams } from 'react-router-dom';
import { Entry } from "./Firestore";
import UserProvider, { AuthButton } from './Auth';
import { addDoc, collection, getDocs, getFirestore, limit, query, where } from 'firebase/firestore';
import { ErrorBoundary } from './ErrorBoundary';

class Adder extends React.Component<any> {
  async componentDidMount(): Promise<void> {
    let { url } = useParams();

    let decoded = decodeURIComponent(url);
    if (!decoded.includes("http")) {
      decoded = "https://" + decoded
    }
    const entry = new Entry(decoded);
    const result = await getDocs(query(collection(getFirestore(), "entries"), where("url", "==", entry.url), limit(1)))
    const navigate = useNavigate();
    if (result.empty) {
      const doc = await addDoc(collection(getFirestore(), "entries"), entry.toFirestore())
      navigate("/edit/" + doc.id)
    } else {
      navigate("/edit/" + result.docs[0].id)
    }
  }

  render() {
    return (
      <div>
        <AppBar position="static">
          <Toolbar>
            <IconButton edge="start" color="inherit" aria-label="menu" onClick={() => {
              this.props.history.push("/");
            }}>
              <HomeIcon />
            </IconButton>
            <Typography variant="h6">
              Adding {this.props.match.params.url}
            </Typography>
            <div style={{ flexGrow: 1 }} />
            <AuthButton />
          </Toolbar>
        </AppBar>
      </div>
    )
  }
}

export const App: FunctionComponent<{}> = ({ }: ReactElement) => {
  let searchTerm = ""
  const [search, setSearch] = useState("")

  return (
    <ErrorBoundary>
      <UserProvider>
        <Router>
          <Routes>
            <Route path="/edit/:id" element={<EditScreen />} />
            <Route path="/add/:url" element={<Adder />} />
            <Route path="/" element={
              <>
                <AppBar position="static" style={{ marginBottom: 12 }}>
                  <Grid container
                    direction="row"
                    justifyContent="space-between"
                  >
                    <Toolbar>
                      <Grid item>
                        <IconButton edge="start" color="inherit" aria-label="menu">
                          <HomeIcon />
                        </IconButton>
                      </Grid>
                      <Grid item xs={10}>
                        <TextField
                          fullWidth
                          id="outlined-basic"
                          label="Search"
                          variant="outlined"
                          onChange={(e) => { searchTerm = e.target.value }}
                          onKeyDown={(event) => {
                            if (event.key === "Enter") {
                              setSearch(searchTerm);
                            }
                          }
                          }
                        />
                      </Grid>
                      <Grid item>
                        <AuthButton />
                      </Grid>
                    </Toolbar>
                  </Grid>
                </AppBar>
                <ResultViewer search={search} />
                <AddField />
              </>
            } />
          </Routes>
        </Router>
      </UserProvider>
    </ErrorBoundary >);
}
