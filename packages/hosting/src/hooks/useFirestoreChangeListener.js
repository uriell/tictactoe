import { useEffect, useContext, useState } from "react";

import { FirebaseContext } from "../firebase";

function useFirestoreChangeListener(collectionName, docId, initialState) {
  const firebase = useContext(FirebaseContext);
  const [doc, setDoc] = useState(initialState);

  useEffect(() => {
    const unsubscribe = firebase
      .collection(collectionName)
      .doc(docId)
      .onSnapshot(doc => setDoc(doc.data()));
    return unsubscribe;
  }, [firebase, collectionName, docId]);

  return doc;
}

export default useFirestoreChangeListener;
