import React, { useContext, useState } from "react";

import { Grid } from "../components";
import { useAuthChange, useFirestoreChangeListener } from "../hooks";
import { FirebaseContext } from "../firebase";

const initialGameState = {
  currentTurn: null,
  rows: [
    { columns: [null, null, null] },
    { columns: [null, null, null] },
    { columns: [null, null, null] }
  ]
};

const Game = ({ gameId }) => {
  const firebase = useContext(FirebaseContext);
  const currentUser = useAuthChange();
  const game = useFirestoreChangeListener("games", gameId, initialGameState);
  const [joiningGame, setJoiningState] = useState(false);

  if (!currentUser) return null;

  const joinGame = firebase.httpsCallable("joinGame");
  const performTurn = firebase.httpsCallable("performTurn");

  const { player1, player2, winner, currentTurn } = game;
  const { uid } = currentUser;

  const needPlayers = () => !player1 || !player2;
  const canJoin = () => needPlayers() && (player1 !== uid && player2 !== uid);
  const youWon = () => winner === uid;
  const youLost = () => winner && !youWon();
  const yourTurn = () => currentTurn === uid;

  function beginJoiningGame() {
    setJoiningState(true);
    return joinGame({ gameId });
  }

  function beginPerformingTurn(x, y) {
    if (yourTurn() && !winner) {
      return performTurn({ gameId, coordinates: [x, y] });
    }
  }

  return (
    <>
      {canJoin() && (
        <button disabled={joiningGame} onClick={beginJoiningGame}>
          {joiningGame ? "Joining game [...]" : "Join Game"}
        </button>
      )}
      {needPlayers() && <h2>Waiting for player...</h2>}
      {game.draw && <h2>Draw ?!</h2>}
      {youWon() && <h2>You won!</h2>}
      {youLost() && <h2>You lost..</h2>}
      {!game.draw && !youWon() && !youLost() && !needPlayers() && yourTurn() && (
        <h2>
          <PlayerAvatar playerId={game.player1} />
          Your turn
        </h2>
      )}
      {!game.draw && !youWon() && !youLost() && !needPlayers() && !yourTurn() && (
        <h2>
          <PlayerAvatar playerId={game.player2} />
          Their turn
        </h2>
      )}
      <Grid rows={game.rows} onCellClick={beginPerformingTurn} />
    </>
  );
};

const PlayerAvatar = ({ playerId }) => (
  <img
    alt="Player"
    className="avatar"
    src={`https://api.adorable.io/avatars/32/${playerId}.png`}
  />
);

export default Game;
