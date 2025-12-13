import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

export const firebaseConfig = {
  apiKey: "AIzaSyBd1wsiQSI1Ycz875Szng9PYhRNGgsExsA",
  authDomain: "fermusic-eed71.firebaseapp.com",
  projectId: "fermusic-eed71",
  storageBucket: "fermusic-eed71.firebasestorage.app",
  messagingSenderId: "999808414650",
  appId: "1:999808414650:web:92c36fa06ca8eaeecfa383",
  measurementId: "G-C54LWMTRLJ"
}
// Initialize Firebase once (evita múltiples inits con HMR)
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Initialize Auth and set persistence once (web)
export const auth = getAuth(app);
export const authReady = setPersistence(auth, browserLocalPersistence)
  .then(() => auth)
  .catch((err) => {
    console.error('[firebase] error setting persistence', err);
    throw err;
  });

// Debug: log minimal app options to confirm configuración cargada
// (no expone datos sensibles más allá de projectId)
if (import.meta.env.DEV) {
  console.log('[firebase] app initialized', {
    projectId: app.options.projectId,
    hasApiKey: Boolean(app.options.apiKey),
    authDomain: app.options.authDomain,
    storageBucket: app.options.storageBucket
  });
}

// Initialize Cloud Firestore
export const db = getFirestore(app);

export default app;
