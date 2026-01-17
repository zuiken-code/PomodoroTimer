// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDehioh8_S_6dX69UaNd7lhgKKKnlwWGUo",
  authDomain: "pomodorotimer-ab787.firebaseapp.com",
  projectId: "pomodorotimer-ab787",
  storageBucket: "pomodorotimer-ab787.firebasestorage.app",
  messagingSenderId: "1827120980",
  appId: "1:1827120980:web:d25c0c2c88c0a43ae9cac1",
  measurementId: "G-2YP66PZ03K",
};

if (!firebaseConfig.apiKey) {
  console.error(
    "APIキーが読み込めていません！.envかGitHub Secretsを確認してください。"
  );
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
