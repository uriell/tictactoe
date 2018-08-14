import React, { Component } from "react";
import { Route, Switch } from "react-router";
import { withRouter } from "react-router-dom";

import * as firebase from "./firebase";
import { Login, Home, Grid } from "./components";
import { Public, Private } from "./routing";

class App extends Component {
  state = { userLoaded: false };

  componentWillMount() {
    firebase
      .auth()
      .onAuthStateChanged(() => this.setState({ userLoaded: true }));
  }

  render() {
    const { userLoaded } = this.state;

    return (
      <div className="App">
        {userLoaded ? (
          <Switch>
            <Public exact path="/" component={Login} redirect="/home" />
            <Private redirect="/">
              <Route exact path="/home" component={Home} />
              <Route exact path="/game/:gameId" component={withRouter(Grid)} />
            </Private>
          </Switch>
        ) : null}
      </div>
    );
  }
}

export default withRouter(App);
