import React from "react";
import { Router } from "@reach/router";

import styles from "./App.module.css";
import { Login, Home, Game } from "./pages";
import { useAuthChange } from "./hooks";

const Page = ({ children }) => <div>{children}</div>;

const App = () => {
  const currentUser = useAuthChange();

  return (
    <div className={styles.App}>
      <header className={styles.AppHeader}>
        <Router>
          {currentUser ? (
            <Page default>
              <Home default path="/home" />
              <Game path="/game/:gameId" />
            </Page>
          ) : (
            <Login default path="/login" />
          )}
        </Router>
      </header>
    </div>
  );
};

export default App;
