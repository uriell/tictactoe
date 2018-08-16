import React, { Component } from "react";
import { Redirect } from "react-router-dom";

import * as firebase from "../firebase";

export default class Home extends Component {
  state = {
    creating: false,
    gameId: null
  };

  createGame() {
    const fn = firebase.functions().httpsCallable("createGame");

    this.setState({ creating: true });

    return fn().then(({ data: gameId }) => this.setState({ gameId }));
  }

  render() {
    const { creating, gameId } = this.state;

    return gameId ? (
      <Redirect to={`/game/${gameId}`} />
    ) : (
      <button onClick={() => this.createGame()}>
        {creating ? "Criando novo jogo..." : "Criar novo jogo"}
      </button>
    );
  }
}
