import React, { Fragment, Component } from "react";

import "./index.css";
import { Cross, Circle } from "../Shapes";
import * as firebase from "../../firebase";

const CROSS = "x";
const CIRCLE = "o";
const GAMES_COLLECTION = "games";

export default class Grid extends Component {
  _db = firebase.firestore();

  static defaultProps = {
    gameId: null
  };

  state = {
    player1: true,
    player2: true,
    currentTurn: null,
    rows: [
      { columns: [null, null, null] },
      { columns: [null, null, null] },
      { columns: [null, null, null] }
    ]
  };

  componentWillMount() {
    this._db.settings({ timestampsInSnapshots: true });

    const { gameId } = this.props.match.params;

    this._db
      .collection(GAMES_COLLECTION)
      .doc(gameId)
      .onSnapshot(doc => {
        const gameData = doc.data();
        this.setState(gameData);
      });
  }

  performTurn(x, y) {
    if (this.state.currentTurn !== firebase.auth().currentUser.uid) return;

    const fn = firebase.functions().httpsCallable("performTurn");
    const { gameId } = this.props.match.params;

    return fn({ gameId, coordinates: [x, y] }).then(console.info);
  }

  joinGame() {
    const fn = firebase.functions().httpsCallable("joinGame");
    const { gameId } = this.props.match.params;

    return fn({ gameId }).then(console.info);
  }

  get canJoin() {
    const uid = firebase.auth().currentUser.uid;
    const { player1, player2 } = this.state;

    return (!player1 || !player2) && (player1 !== uid && player2 !== uid);
  }

  get yourTurn() {
    const uid = firebase.auth().currentUser.uid;
    return this.state.currentTurn === uid;
  }

  get won() {
    const uid = firebase.auth().currentUser.uid;
    return this.state.winner === uid;
  }

  get waitingForPlayer() {
    return !this.state.player2;
  }

  render() {
    const { rows, player1, player2 } = this.state;

    return (
      <Fragment>
        {this.canJoin ? (
          <button onClick={() => this.joinGame()}>Join game</button>
        ) : null}
        <center>
          <h2>
            {this.waitingForPlayer ? (
              "Aguardando outro jogador.."
            ) : this.won ? (
              "Você ganhou!"
            ) : this.yourTurn ? (
              <Fragment>
                <img
                  className="avatar"
                  src={`https://api.adorable.io/avatars/32/${player1}.png`}
                />
                Sua vez
              </Fragment>
            ) : (
              <Fragment>
                <img
                  className="avatar"
                  src={`https://api.adorable.io/avatars/32/${player2}.png`}
                />
                Vez do adversário
              </Fragment>
            )}
          </h2>
        </center>
        <br />
        <div className="Grid">
          {rows.map((row, x) => (
            <div className="Grid Grid-Row" key={x}>
              {row.columns.map((column, y) => (
                <div
                  className="Grid Grid-Column"
                  onClick={() => this.performTurn(x, y)}
                  key={y}
                >
                  {decideColumnContent(column)}
                </div>
              ))}
            </div>
          ))}
        </div>
      </Fragment>
    );
  }
}

const decideColumnContent = column =>
  column === CROSS ? <Cross /> : column === CIRCLE ? <Circle /> : "";
