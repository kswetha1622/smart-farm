import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDGSPS6XkB5fF8gE90MchA4FbErXcKlY4Y",
  authDomain: "smart-farmer-ai-f0c5b.firebaseapp.com",
  projectId: "smart-farmer-ai-f0c5b",
  storageBucket: "smart-farmer-ai-f0c5b.firebasestorage.app",
  messagingSenderId: "32209281304",
  appId: "1:32209281304:web:273b366547e8e9b010fe6d",
  measurementId: "G-8B78RYJQ1T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
