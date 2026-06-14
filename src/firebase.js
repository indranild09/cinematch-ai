import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBlNz-SASsSdWe1FaixEaZeDXVSPpq0Qu4",
  authDomain: "cinematch-ai-f0b05.firebaseapp.com",
  projectId: "cinematch-ai-f0b05",
  storageBucket: "cinematch-ai-f0b05.firebasestorage.app",
  messagingSenderId: "340459075380",
  appId: "1:340459075380:web:4b0c07fd2669bd3d471761",
  measurementId: "G-1QCR5WK41E"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;