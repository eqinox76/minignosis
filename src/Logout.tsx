import { IconButton } from "@material-ui/core";
import firebase from "firebase";
import PersonOutlineIcon from "@material-ui/icons/PersonOutline";
import * as React from "react";

export default function LogoutButton() {
  return (
    <IconButton
      color="inherit"
      aria-label="sign out"
      onClick={() => {
        firebase.auth().signOut().then(function () {
          window.location.reload();
        }, function (error) {
          console.log(error);
        });
      }}>
      <PersonOutlineIcon/>
    </IconButton>
  )
}
