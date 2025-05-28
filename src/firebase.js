// src/firebase.js
// Purpose: Initializes Firebase and exports necessary instances.

import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, setLogLevel } from 'firebase/firestore';

// --- Configuration (DO NOT EDIT THESE LINES IN THIS FILE) ---
// --- End Configuration ---

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
  };

  const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY || "";

let app;
let auth;
let db;

if (Object.keys(firebaseConfig).length > 0) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    setLogLevel('debug'); // Or your preferred log level
} else {
    console.warn("Firebase config is empty. Firebase services will not be available.");
}

export { app, auth, db, onAuthStateChanged, signInAnonymously, signInWithCustomToken };
export { collection, addDoc, doc, updateDoc, deleteDoc, onSnapshot, query, serverTimestamp } from 'firebase/firestore';