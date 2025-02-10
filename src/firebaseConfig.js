import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAciYIZv1Ug_d34asxn69gxGjBqcknQ0BA",
  authDomain: "reloj-checador-e9753.firebaseapp.com",
  projectId: "reloj-checador-e9753",
  storageBucket: "reloj-checador-e9753.firebasestorage.app",
  messagingSenderId: "425957436672",
  appId: "1:425957436672:web:45ed993e2f0b0ca29e97e5",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
export { auth, googleProvider, db };