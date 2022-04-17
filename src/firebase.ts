import { initializeApp } from 'firebase/app';

const response = await fetch("/__/firebase/init.json")
const data = await response.json();

export const firebase = initializeApp(data);


// export const googleProvider = new firebase.auth.GoogleAuthProvider();
// export const auth = firebase.auth();