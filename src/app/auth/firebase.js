// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCckc-v_PcYJxoOXfPT5iinGKvsEnYdrv0",
  authDomain: "techtextile-ca673.firebaseapp.com",
  projectId: "techtextile-ca673",
  storageBucket: "techtextile-ca673.appspot.com",
  messagingSenderId: "124169165818",
  appId: "1:124169165818:web:4e85ad9228b39b5e536243",
  measurementId: "G-07ZHP074CR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);