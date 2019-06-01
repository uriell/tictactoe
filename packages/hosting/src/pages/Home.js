import React, { useMemo, useState, useContext } from "react";
import { navigate } from "@reach/router";

import { FirebaseContext } from "../firebase";

const Home = () => {
  const firebase = useContext(FirebaseContext);
  const [loading, setLoading] = useState(false);

  const createGame = useMemo(() => firebase.httpsCallable("createGame"), [
    firebase
  ]);

  function beginGameCreation() {
    setLoading(true);
    return createGame().then(({ data: gameId }) => navigate("/game/" + gameId));
  }

  return (
    <button disabled={loading} onClick={beginGameCreation}>
      {loading ? "Creating new game [...]" : "Create new game"}
    </button>
  );
};

export default Home;
