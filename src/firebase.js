// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, setDoc } from "firebase/firestore";

// Your Firebase configuration (from the Firebase console)
const firebaseConfig = {
  apiKey: "AIzaSyBwucfhssqq-MDxGq125Jbu9exDtDfjw4w",
  authDomain: "todo-frontend-291d3.firebaseapp.com",
  projectId: "todo-frontend-291d3",
  storageBucket: "todo-frontend-291d3.appspot.com",
  messagingSenderId: "870318971254",
  appId: "1:870318971254:web:4f9590066587570a968257",
  measurementId: "G-F979RYVQFB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get Firestore instance
const db = getFirestore(app);

// Export the Firestore instance
export { db, collection, doc, setDoc };
