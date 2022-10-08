import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDchOvXLlYAhkpJZC_WQFhwg93F28uJvPQ",
  authDomain: "tterminal-e59ef.firebaseapp.com",
  projectId: "tterminal-e59ef",
  storageBucket: "tterminal-e59ef.appspot.com",
  messagingSenderId: "241427425802",
  appId: "1:241427425802:web:72a3c64f39c6dc32f24df3"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

export { app, database, auth };