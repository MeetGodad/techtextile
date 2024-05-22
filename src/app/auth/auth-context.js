"use client";
 
import { useContext, createContext, useState, useEffect } from "react";
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
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
      const userCredential = await signInWithEmailAndPassword(auth , email, password);
      return userCredential.user.uid;
    } catch (error) {
      console.error('Failed to sign in:', error);
    }
  }

  async function emailSignUp(email, password) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth,email, password);
      return userCredential.user.uid;
    } catch (error) {
      console.error('Failed to sign up:', error);
      throw error;
    }
  }
 
  const firebaseSignOut = () => {
    return signOut(auth);
  };
 
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setUser(user);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);
 
  return (
    <AuthContext.Provider value={{ user, googleSignIn, emailSignIn, emailSignUp , firebaseSignOut }}>
      {children}
    </AuthContext.Provider>
  );
};
 
export const useUserAuth = () => {
  return useContext(AuthContext);
};