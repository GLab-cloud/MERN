// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-a619c.firebaseapp.com",
  projectId: "mern-estate-a619c",
  storageBucket: "mern-estate-a619c.firebasestorage.app",
  messagingSenderId: "434893333564",
  appId: "1:434893333564:web:4cff23d92625ac79bacf39",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
