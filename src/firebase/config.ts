// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getStorage, connectStorageEmulator } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCzw_bCFtgpBVpf8ODGyXoJUc5QSYlgN5k",
  authDomain: "calificaciones-app.firebaseapp.com",
  projectId: "calificaciones-app",
  storageBucket: "calificaciones-app.firebasestorage.app",
  messagingSenderId: "491302959550",
  appId: "1:491302959550:web:63533e05cac168fc6c61ef"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Use local emulators when in development
if (import.meta.env.DEV) {
  // Connect to Firebase emulators
  connectAuthEmulator(auth, "http://localhost:9099");
  connectFirestoreEmulator(db, "localhost", 8080);
  connectStorageEmulator(storage, "localhost", 9199);
}

export default app;