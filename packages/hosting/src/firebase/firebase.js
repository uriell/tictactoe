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
  messagingSenderId: "207073192140",
  appId: "1:207073192140:web:4a62256e5990de6f"
});

class Firebase {
  constructor(firebaseApp) {
    this.app = firebaseApp;
  }

  get auth() {
    return this.app.auth;
  }

  get functions() {
    return this.app.functions;
  }

  get firestore() {
    return this.app.firestore;
  }

  onAuthChange(...args) {
    return this.auth().onAuthStateChanged(...args);
  }

  httpsCallable(...args) {
    return this.functions().httpsCallable(...args);
  }

  collection(...args) {
    return this.firestore().collection(...args);
  }
}

export default new Firebase(firebase);
