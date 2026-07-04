import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser
} from "firebase/auth";
import { 
  initializeFirestore,
  doc, 
  getDoc, 
  setDoc,
  updateDoc
} from "firebase/firestore";
import firebaseConfig from "../../firebase-applet-config.json";

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
const auth = getAuth(app);

// Use Google Auth Provider
const googleProvider = new GoogleAuthProvider();
// Custom parameters for better prompt behavior
googleProvider.setCustomParameters({
  prompt: "select_account"
});

// Initialize Firestore with specific database ID from configuration
const db = initializeFirestore(app, {}, firebaseConfig.firestoreDatabaseId || "(default)");

export {
  app,
  auth,
  db,
  googleProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  doc,
  getDoc,
  setDoc,
  updateDoc
};

export type { FirebaseUser };
