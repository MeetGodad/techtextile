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
import { ref ,  deleteObject} from "firebase/storage";
import { auth } from "./firebase";
import {storage} from './firebase';
 
const AuthContext = createContext();
 
export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); 
  
 
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
  

  const deleteImageFromFirebase = async (imageUrl) => {
    try {
  
      // Create a reference to the file to delete
      const imageRef = ref(storage, imageUrl);
  
      // Delete the file
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
    <AuthContext.Provider value={{ user, googleSignIn, emailSignIn, emailSignUp , firebaseSignOut , deleteImageFromFirebase }}>
      {children}
    </AuthContext.Provider>
  );
};
 
export const useUserAuth = () => {
  return useContext(AuthContext);
};