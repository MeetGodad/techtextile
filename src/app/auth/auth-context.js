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
import { ref, deleteObject } from "firebase/storage";
import { auth } from "./firebase";
import { storage } from './firebase';

const AuthContext = createContext();

const getErrorMessage = (errorCode) => {
  const errorMessages = {
    'auth/email-already-in-use': 'The email address is already in use by another account.',
    'auth/invalid-email': 'The email address is not valid.',
    'auth/user-disabled': 'The user account has been disabled by an administrator.',
    'auth/user-not-found': 'There is no user record corresponding to this identifier.',
    'auth/wrong-password': 'The password is invalid or the user does not have a password.',
    // Add more error codes and messages as needed
    'default': 'An unexpected error occurred. Please try again.'
  };
  return errorMessages[errorCode] || errorMessages['default'];
};

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const googleSignIn = () => {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  };

  async function emailSignIn(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user.uid;
    } catch (error) {
      console.error('Failed to sign in:', error);
      throw new Error(getErrorMessage(error.code));
    }
  }

  async function emailSignUp(email, password) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      return userCredential.user.uid;
    } catch (error) {
      console.error('Failed to sign up:', error);
      throw new Error(getErrorMessage(error.code));
    }
  }

  const firebaseSignOut = () => {
    return signOut(auth);
  };

  const deleteImageFromFirebase = async (imageUrl) => {
    try {
      const imageRef = ref(storage, imageUrl);
      await deleteObject(imageRef);
      console.log('File deleted successfully');
    } catch (error) {
      console.error('Error removing file: ', error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, googleSignIn, emailSignIn, emailSignUp, firebaseSignOut, deleteImageFromFirebase }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useUserAuth = () => {
  return useContext(AuthContext);
};