import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyAkBCGABoimhObkc3Vo0bMNZ7w2OcFcIx8",
    authDomain: "proquan-2bfff.firebaseapp.com",
    projectId: "proquan-2bfff",
    storageBucket: "proquan-2bfff.firebasestorage.app",
    messagingSenderId: "484447343258",
    appId: "1:484447343258:web:f6c5f679c38d914fc90523",
    measurementId: "G-9HXYER9NRM"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);


export { app, auth, db };

