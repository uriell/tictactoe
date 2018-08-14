const admin = require("firebase-admin");

admin.initializeApp();

const db = admin.firestore();

db.settings({ timestampsInSnapshots: true });

const createGame = require("./createGame");
const performTurn = require("./performTurn");
const joinGame = require("./joinGame");

exports.createGame = createGame(db);
exports.performTurn = performTurn(db);
exports.joinGame = joinGame(db);
