import { initializeApp } from "firebase/app";
import React from "react";
import * as ReactDOM from 'react-dom';
import { App } from "./App";

fetch('/__/firebase/init.json')
  .then((response) => {
    return response.json()
  })
  .then(data => {
    initializeApp(data);

    ReactDOM.render(
      <App />,
      document.getElementById("root")
    );
  });

