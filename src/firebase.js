import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const config = {
  apiKey: "AIzaSyDHMKHch2nFclkOZ9nUxSaaL8UwhKdGN1s",
  authDomain: "hajongon-todo.firebaseapp.com",
  projectId: "hajongon-todo",
  storageBucket: "hajongon-todo.appspot.com",
  messagingSenderId: "386379489004",
  appId: "1:386379489004:web:50c0ce0ead7ff15af38fc9",
  measurementId: "G-FEVT2YDTBJ",
};

const app = initializeApp(config);
const firestore = getFirestore(app);

export default firestore;
