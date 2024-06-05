import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore"; // Import connectFirestoreEmulator

const firebaseConfig = {
  apiKey: "AIzaSyDEaLat4N9v0K3XeTT4RySCYNlh4LLADNs",
  authDomain: "appfire-4a743.firebaseapp.com",
  projectId: "appfire-4a743",
  storageBucket: "appfire-4a743.appspot.com",
  messagingSenderId: "1045144144881",
  appId: "1:1045144144881:web:f5d873c783e2419410d250",
  measurementId: "G-K9D85EDT4K"
};

// Inicjalizacja Firebase
const app = initializeApp(firebaseConfig);

// Inicjalizacja Analytics
const analytics = getAnalytics(app);

// Inicjalizacja Firestore
const firestore = getFirestore(app);

// Podłączenie do emulatora Firestore, jeśli aplikacja działa lokalnie
if (window.location.hostname === "localhost") {
  connectFirestoreEmulator(firestore, "localhost", 8080);
}

// Eksportowanie obiektów, które mogą być używane w innych plikach
export { app, analytics, firestore };