// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDTl4mWEjkkuqX3jrxDWrMpdRTqzGb_r98",
    authDomain: "healty-store.firebaseapp.com",
    projectId: "healty-store",
    storageBucket: "healty-store.firebasestorage.app",
    messagingSenderId: "197592499985",
    appId: "1:197592499985:web:719a37bf8cd7b955bceeb0",
    measurementId: "G-N124DBK5BQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };