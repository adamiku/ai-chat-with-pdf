import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBDFUOd5QdZnlSP7bQOo_MjPx4RteQaf3o",
  authDomain: "ai-chat-with-pdf-1ae21.firebaseapp.com",
  projectId: "ai-chat-with-pdf-1ae21",
  storageBucket: "ai-chat-with-pdf-1ae21.appspot.com",
  messagingSenderId: "35985117577",
  appId: "1:35985117577:web:d5ae75e86ffd2e5d535158",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };
