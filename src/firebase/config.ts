/**
 * Firebase configuration object using the provided project credentials.
 * These keys are essential for connecting the client-side SDK to Firebase services.
 */
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

export const firebaseConfig = {
  apiKey: "AIzaSyCZ6-iJTcaYNOomJmpTFMMZmtf5kvoNW40",
  authDomain: "nexamart-c462f.firebaseapp.com",
  projectId: "nexamart-c462f",
  storageBucket: "nexamart-c462f.firebasestorage.app",
  messagingSenderId: "212119658915",
  appId: "1:212119658915:web:2a9bec5c633fa4f6b73a16",
  measurementId: "G-CSQ55H0KEK"
}; 

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
