const functions = require("firebase-functions");

const GAMES_COLLECTION = "games";

module.exports = db =>
  functions.https.onCall((params, context) => {
    if (!context.auth) {
      return { error: "Unauthenticated" };
    }

    const { gameId } = params;
    const { uid } = context.auth;

    return db
      .collection(GAMES_COLLECTION)
      .doc(gameId)
      .get()
      .then(doc => {
        const gameData = doc.data();

        if (!gameData) {
          return { error: "Game not found." };
        }

        if (gameData.player1 && gameData.player2) {
          return { error: "Already two players in." };
        }

        gameData.player2 = uid;

        return doc.ref.update(
          {
            player2: uid,
            currentTurn: gameData[decideFirstTurn()]
          },
          { merge: true }
        );
      })
      .then(() => ({ joined: true }));
  });

const decideFirstTurn = () => (Math.random() >= 0.5 ? "player1" : "player2");
