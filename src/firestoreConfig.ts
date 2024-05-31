import {initializeApp} from "firebase/app";
import {getFirestore} from "firebase/firestore";
import {getAuth} from "firebase/auth";
import {getStorage} from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyDhfcLgYpaN98ghsXvydAkO3n73xHQAyDk",
    authDomain: "hercules-gym-app.firebaseapp.com",
    projectId: "hercules-gym-app",
    storageBucket: "hercules-gym-app.appspot.com",
    messagingSenderId: "471869125846",
    appId: "1:471869125846:web:dc8d359f93557f8c3c4577",
    measurementId: "G-Y7DYZ18PY6"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

export default db;