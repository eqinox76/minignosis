import React, { createContext, useState, useContext } from "react";
import PersonIcon from "@material-ui/icons/Person";
import { IconButton, Tooltip, Avatar } from "@material-ui/core";
import { getAuth, GoogleAuthProvider, signInWithPopup, User } from "firebase/auth";

class UserInfo {
    user: User
    authorized: boolean
}

export const UserContext = createContext<UserInfo>({ user: null, authorized: false });

let authRegistered = false;
const provider = new GoogleAuthProvider();

function UserProvider(props: { children: React.ReactNode; }) {
    const [user, setUser] = useState<User>()

    if (!authRegistered) {
        authRegistered = true;
        getAuth().onAuthStateChanged(userAuth => {
            if (userAuth === null) {
                console.log("logged out")
            } else {
                console.log(`${userAuth.email} logged in`)
            }
            setUser(userAuth);
        });
    }

    return (
        <UserContext.Provider value={{ user: user, authorized: user !== null }}>
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
                        signInWithPopup(getAuth(), provider);
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
                    getAuth().signOut().catch(function (error) {
                        console.log(error);
                    });
                }} />
        </Tooltip>
    )
}
export default UserProvider;