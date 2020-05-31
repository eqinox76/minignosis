import React, { createContext, useState, useEffect, useContext } from "react";
import PersonIcon from "@material-ui/icons/Person";
import { IconButton, Tooltip, Avatar } from "@material-ui/core";
import { auth } from "firebase";
import firebase from "firebase";

class UserInfo {
    user: firebase.User
}

export const UserContext = createContext<UserInfo>({ user: null });

let authRegistered = false;

function UserProvider(props: { children: React.ReactNode; }) {
    const [user, setUser] = useState<firebase.User>()

    if (!authRegistered) {
        authRegistered = true;
        auth().onAuthStateChanged(userAuth => {
            if (userAuth === null) {
                console.log("logged out")
            } else {
                console.log(`${userAuth.email} logged in`)
            }
            setUser(userAuth);
        });
    }

    return (
        <UserContext.Provider value={{ user: user }}>
            {props.children}
        </UserContext.Provider>
    );
}

export function authorized(user: UserInfo): boolean {
    return user.user !== null && user.user !== undefined;
}

export function AuthButton() {
    const user = useContext(UserContext);
    if (!authorized(user)) {
        return (
            <Tooltip title="Sign In">
                <IconButton
                    onClick={() => {
                        let provider = new auth.GoogleAuthProvider();
                        auth().signInWithPopup(provider);
                    }}>
                    <PersonIcon />
                </IconButton>
            </Tooltip>
        )
    }
    return (
        <Tooltip title="Sign Out">
            <Avatar src={user.user.photoURL}
                onClick={() => {
                    firebase.auth().signOut().catch(function (error) {
                        console.log(error);
                    });
                }} />
        </Tooltip>
    )
}
export default UserProvider;