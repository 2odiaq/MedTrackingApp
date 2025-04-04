// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
// Uncomment if using Firestore
// import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBcm8PbVc6ndUbfNg-hfy1wiJMKx2Rhh1g",
  authDomain: "healthtracker-e91f1.firebaseapp.com",
  projectId: "healthtracker-e91f1",
  storageBucket: "healthtracker-e91f1.firebasestorage.app",
  messagingSenderId: "868563550799",
  appId: "1:868563550799:web:50e269b6e5b09b75ed203a",
  measurementId: "G-LJEDM6S9S9",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

// Uncomment if using Firestore
// const db = getFirestore(app);

// Export for use in components
export { app, auth, analytics };
// Uncomment if using Firestore
// export { db };
