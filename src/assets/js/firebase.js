// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from "firebase/firestore";
import {getStorage} from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDm8zNPr1GKuKAmgipbDnJ1hQpXiAEMHGU",
    authDomain: "portfolio-hugo-pinna.firebaseapp.com",
    projectId: "portfolio-hugo-pinna",
    storageBucket: "portfolio-hugo-pinna.appspot.com",
    messagingSenderId: "322582929257",
    appId: "1:322582929257:web:6c4dddbafdac82cc0467f8",
    measurementId: "G-VFQ9TKG8YY"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const storage = getStorage();

