import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"; // Dodajemy import dla Firestore

const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
  measurementId: ""
};

// Inicjalizacja Firebase
const app = initializeApp(firebaseConfig);

// Inicjalizacja Analytics
const analytics = getAnalytics(app);

// Inicjalizacja Firestore
const firestore = getFirestore(app);

// Eksportowanie obiektów, które mogą być używane w innych plikach
export { app, analytics, firestore };