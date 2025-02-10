import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Configuración de Firebase para la aplicación.
const firebaseConfig = {
  apiKey: "AIzaSyAciYIZv1Ug_d34asxn69gxGjBqcknQ0BA",
  authDomain: "reloj-checador-e9753.firebaseapp.com",
  projectId: "reloj-checador-e9753",
  storageBucket: "reloj-checador-e9753.firebasestorage.app",
  messagingSenderId: "425957436672",
  appId: "1:425957436672:web:45ed993e2f0b0ca29e97e5",
};

// Inicializa la aplicación de Firebase con la configuración proporcionada.
const app = initializeApp(firebaseConfig);

// Inicializa Firestore (base de datos) con la aplicación de Firebase.
const db = getFirestore(app);

// Inicializa el servicio de autenticación con la aplicación de Firebase.
const auth = getAuth(app);

// Configura el proveedor de autenticación de Google.
const googleProvider = new GoogleAuthProvider();

// Exporta las instancias de autenticación, proveedor de Google y Firestore para su uso en otras partes de la aplicación.
export { auth, googleProvider, db };