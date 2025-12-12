import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAHcGgOi9D0rnAsRLD0adCk8IuRvq7wT9Y",
  authDomain: "interview-expert-db-auth.firebaseapp.com",
  projectId: "interview-expert-db-auth",
  storageBucket: "interview-expert-db-auth.firebasestorage.app",
  messagingSenderId: "637944126902",
  appId: "1:637944126902:web:65e67123b955e03d5e7517",
  measurementId: "G-3RMHGN0RTX"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);