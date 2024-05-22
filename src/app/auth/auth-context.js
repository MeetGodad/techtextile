"use strict";
 
import { useContext, createContext, useState, useEffect } from "react";
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  EmailAuthProvider,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "./firebase";
 
const AuthContext = createContext();
 
export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
 
  const googleSignIn = () => {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  };

  async function emailSignIn(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(email, password);
      // userCredential.user.uid is the user's ID
      return userCredential.user.uid;
    } catch (error) {
      console.error(error);
      // Handle errors here
    }
  }

  async function emailSignUp(email, password) {
    try {
      const userCredential = await createUserWithEmailAndPassword(email, password);
      // userCredential.user.uid is the user's ID
      return userCredential.user.uid;
    } catch (error) {
      console.error(error);
      // Handle errors here
    }
  }
 
  const firebaseSignOut = () => {
    return signOut(auth);
  };
 
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []); // Removed 'user' from the dependency array
 
  return (
    <AuthContext.Provider value={{ user, googleSignIn, emailSignIn, emailSignUp , firebaseSignOut }}>
      {children}
    </AuthContext.Provider>
  );
};
 

export const useUserAuth = () => {
  return useContext(AuthContext);
};