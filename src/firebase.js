// src/firebase.js
// Purpose: Initializes Firebase and exports necessary instances.

import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, setLogLevel } from 'firebase/firestore';

// --- Configuration ---
// These variables will be sourced from environment variables in a Create React App setup
// For local development, ensure you have a .env file with REACT_APP_... variables.
const localAppId = process.env.REACT_APP_APP_ID || 'taskflow-ai-app'; // Default if not set
const localInitialAuthToken = process.env.REACT_APP_INITIAL_AUTH_TOKEN || undefined; // Default if not set

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_FIREBASE_APP_ID, // Note: Firebase uses this for its own internal app ID, distinct from our 'localAppId' for paths
  };



// Export these so App.js can use them
export const appId = localAppId;
export const initialAuthToken = localInitialAuthToken;

let app;
let auth;
let db;

// Check if essential config values are present (especially apiKey)
if (firebaseConfig.apiKey) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    setLogLevel('debug'); // Or your preferred log level
} else {
    console.warn("Firebase apiKey is missing. Firebase services will not be available. Ensure your .env file is set up with REACT_APP_FIREBASE_API_KEY and other config values.");
}

export { app, auth, db, onAuthStateChanged, signInAnonymously, signInWithCustomToken };
export { collection, addDoc, doc, updateDoc, deleteDoc, onSnapshot, query, serverTimestamp } from 'firebase/firestore';