const functions = require("firebase-functions");
const uuid = require("uuid");

const GAMES_COLLECTION = "games";
const DEFAULT_GAME = {
  winner: null,
  player1: null,
  player2: null,
  currentTurn: null,
  rows: [
    { columns: [null, null, null] },
    { columns: [null, null, null] },
    { columns: [null, null, null] }
  ]
};

module.exports = db =>
  functions.https.onCall((params, context) => {
    if (!context.auth) {
      return { error: "Unauthenticated" };
    }

    const gameId = uuid.v4();

    const { uid: player1 } = context.auth;

    return db
      .collection(GAMES_COLLECTION)
      .doc(gameId)
      .set(Object.assign({}, DEFAULT_GAME, { player1 }))
      .then(() => gameId);
  });
