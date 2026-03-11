// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
//import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDkN1d7ZND3YZ7cuLCboFUdyd18_Bu2MWc",
  authDomain: "ungasevaiotp.firebaseapp.com",
  projectId: "ungasevaiotp",
  storageBucket: "ungasevaiotp.firebasestorage.app",
  messagingSenderId: "245953054198",
  appId: "1:245953054198:web:60ca7ad199d159cb2eb3d7",
  measurementId: "G-VD16Q5VG9Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
//const analytics = getAnalytics(app);