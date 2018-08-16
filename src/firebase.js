import * as firebase from "firebase/app";

import "firebase/auth";
import "firebase/functions";
import "firebase/firestore";

firebase.initializeApp({
  apiKey: "AIzaSyAs9OcwhWmmOj7Zsl4UhyYGB9oQ5J7EIow",
  authDomain: "dito-tictactoe.firebaseapp.com",
  databaseURL: "https://dito-tictactoe.firebaseio.com",
  projectId: "dito-tictactoe",
  storageBucket: "dito-tictactoe.appspot.com",
  messagingSenderId: "207073192140"
});

export const auth = firebase.auth;
export const functions = firebase.functions;
export const firestore = firebase.firestore;

let currentUser;
export const getCurrentUser = () =>
  currentUser
    ? Promise.resolve(currentUser)
    : new Promise(resolve =>
        firebase.auth().onAuthStateChanged(user => {
          currentUser = user;
          resolve(currentUser);
        })
      );

export { currentUser };
