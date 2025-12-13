import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: '...tu apiKey...',
  authDomain: 'fermusic-eed71.firebaseapp.com',
  projectId: 'fermusic-eed71',
  storageBucket: 'fermusic-eed71.firebasestorage.app',
  messagingSenderId: '999808414650',
  appId: '1:999808414650:web:92c36fa06ca8eaeecfa383',
  measurementId: 'G-C54LWMTRLJ'
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;