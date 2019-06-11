import { useContext, useEffect, useState } from "react";

import { FirebaseContext } from "../firebase";

function useAuthChange() {
  const firebase = useContext(FirebaseContext);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = firebase.onAuthChange(setCurrentUser);
    return unsubscribe;
  }, [firebase]);

  return currentUser;
}

export default useAuthChange;
