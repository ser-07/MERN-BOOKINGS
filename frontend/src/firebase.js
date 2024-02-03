// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "mern-bookings.firebaseapp.com",
  projectId: "mern-bookings",
  storageBucket: "mern-bookings.appspot.com",
  messagingSenderId: "761113290436",
  appId: "1:761113290436:web:ad7ddab44c16b02ad24b91",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
