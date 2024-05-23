"use client";
 
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

  const emailSignIn = async (email, password) =>  { 
    try {
      const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
      // userCredential.user.uid is the user's ID
      return userCredential.user.uid;
  } catch (error) {
    console.log("Error signing in with email and password" , error);
  }
};

  const emailSignUp = (email, password) => { 
    try {
    return createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
    console.log("Error signing up with email and password" , error);
    }
  };
 
  const firebaseSignOut = () => {
    return signOut(auth);
  };
 
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, [user]);
 
  return (
    <AuthContext.Provider value={{ user,googleSignIn, emailSignIn , emailSignUp , firebaseSignOut }}>
      {children}
    </AuthContext.Provider>
  );
};
 

export const useUserAuth = () => {
  return useContext(AuthContext);
};