const functions = require("firebase-functions");

const GAMES_COLLECTION = "games";
const validCoords = [0, 1, 2];

module.exports = db =>
  functions.https.onCall((params, context) => {
    if (!context.auth) {
      return { error: "Unauthenticated" };
    }

    const { gameId, coordinates } = params;
    const { uid } = context.auth;

    if (
      coordinates.length !== 2 ||
      !validCoords.includes(coordinates[0]) ||
      !validCoords.includes(coordinates[1])
    ) {
      return { error: "Invalid coordinates" };
    }

    return db
      .collection(GAMES_COLLECTION)
      .doc(gameId)
      .get()
      .then(doc => {
        const gameData = doc.data();

        if (!gameData) {
          return { error: "Game not found." };
        }

        if (gameData.currentTurn !== uid) {
          return { error: "Not your turn!" };
        }

        const desiredColumn =
          gameData.rows[coordinates[0]].columns[coordinates[1]];

        if (desiredColumn !== null) {
          return { error: "Column already filled" };
        }

        gameData.rows[coordinates[0]].columns[coordinates[1]] = decideShape(
          gameData,
          uid
        );

        const winner = getWinner(gameData);

        // eslint-disable-next-line
        return doc.ref
          .update(
            Object.assign(
              {},
              {
                rows: gameData.rows,
                currentTurn: decideNextTurn(gameData, winner)
              },
              winner
            ),
            { merge: true }
          )
          .then(() => winner);
      });
  });

const decideShape = (game, uid) => (game.player1 === uid ? "x" : "o");
const decideNextTurn = (game, winner) => {
  if (winner.winner) return null;
  if (game.currentTurn === game.player1) return game.player2;
  return game.player1;
};

const getWinner = ({ rows, player1, player2 }) => {
  const checkPossibility = coords => {
    const [[x1, y1], [x2, y2], [x3, y3]] = coords;
    const one = rows[x1].columns[y1];
    const two = rows[x2].columns[y2];
    const three = rows[x3].columns[y3];

    const values = [one, two, three].join("");
    if (values === "xxx") return "x";
    if (values === "ooo") return "o";
    return null;
  };

  const winningMatches = [
    [[0, 0], [0, 1], [0, 2]],
    [[1, 0], [1, 1], [1, 2]],
    [[2, 0], [2, 1], [2, 2]],
    [[0, 0], [1, 0], [2, 0]],
    [[0, 1], [1, 1], [2, 1]],
    [[0, 2], [1, 2], [2, 2]],
    [[0, 0], [1, 1], [2, 2]],
    [[0, 2], [1, 1], [2, 0]]
  ];

  let winner =
    winningMatches
      .map(checkPossibility)
      .filter(match => match)
      .shift() || null;

  if (winner === "x") {
    winner = player1;
  } else if (winner === "o") {
    winner = player2;
  }

  if (!winner) {
    const rowsWithEmptyColumns = rows.filter(
      row => row.columns.filter(column => !column).length
    );

    if (!rowsWithEmptyColumns.length) {
      return { draw: true };
    }
  }

  return { winner };
};
