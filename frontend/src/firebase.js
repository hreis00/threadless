// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAS6slm_tmZp3Jv_uWecz8_T9yWuPKDtbg",
  authDomain: "threadless-7d1ea.firebaseapp.com",
  databaseURL:
    "https://threadless-7d1ea-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "threadless-7d1ea",
  storageBucket: "threadless-7d1ea.appspot.com",
  messagingSenderId: "560368521687",
  appId: "1:560368521687:web:670165c62f85b132577b92",
  measurementId: "G-T8YMZSQS77",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
