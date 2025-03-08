import { initializeApp } from "firebase/app";
import { getFirestore, collection, query, orderBy, onSnapshot, addDoc, serverTimestamp , where, doc, updateDoc, arrayUnion,}  from "firebase/firestore";

import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";











// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAj2jk9zXS-RzXsB2qmj6D7LAlbU0ougt4",
  authDomain: "hirexerchat.firebaseapp.com",
  projectId: "hirexerchat",
  storageBucket: "hirexerchat.appspot.com",
  messagingSenderId: "330213537989",
  appId: "1:330213537989:web:c4fc9f0acdad98c80158ac",
  measurementId: "G-QJC6M8T792"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { db, collection, query, orderBy, onSnapshot, addDoc, serverTimestamp , where, doc, updateDoc, arrayUnion, auth, provider, signInWithPopup};