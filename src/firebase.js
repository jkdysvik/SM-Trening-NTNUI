// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDae7Uf3cgIhC-RFgsyTsfZ4v5ANkF7C6M",
  authDomain: "vannstand-ntnui.firebaseapp.com",
  projectId: "vannstand-ntnui",
  storageBucket: "vannstand-ntnui.firebasestorage.app",
  messagingSenderId: "531769221096",
  appId: "1:531769221096:web:4c8364227c0e3448cbce5d",
  measurementId: "G-MN2B6YT638"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);