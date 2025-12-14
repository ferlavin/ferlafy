import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth';
import { auth, authReady } from '../config/firebase';

// auth se inicializa en config/firebase con persistencia ya configurada
const getAuthSafe = () => {
  if (import.meta.env.DEV) {
    console.log('[authService] auth.app options', {
      projectId: auth.app?.options?.projectId,
      hasApiKey: Boolean(auth.app?.options?.apiKey),
      authDomain: auth.app?.options?.authDomain,
      storageBucket: auth.app?.options?.storageBucket
    });
  }
  if (!auth?.app?.options?.apiKey) {
    throw new Error('Firebase Auth no tiene apiKey (configuración no cargada)');
  }
  return auth;
};

// Esperar a que se configure persistencia antes de usar auth
const ensurePersistence = async () => {
  await authReady;
  return getAuthSafe();
};

export const authService = {
  // Registrar nuevo usuario
  register: async (email, password, nombre) => {
    try {
      const authInstance = await ensurePersistence();
      // 1. Crear usuario en Firebase Auth (frontend)
      const userCredential = await createUserWithEmailAndPassword(authInstance, email, password);
      
      // 2. Obtener token de autenticación
      const idToken = await userCredential.user.getIdToken();
      
      // 3. Llamar backend para guardar datos adicionales en Firestore
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify({
          nombre,
          email
        })
      });

      const data = await response.json();

      if (!response.ok) {
        // Si el backend falla, eliminar el usuario de Firebase Auth
        await userCredential.user.delete();
        throw new Error(data.error || 'Error al registrar usuario');
      }

      return {
        user: data.user,
        token: idToken
      };
    } catch (error) {
      throw error;
    }
  },

  // Iniciar sesión
  login: async (email, password) => {
    try {
      const authInstance = await ensurePersistence();
      // 1. Autenticar con Firebase (valida email/password)
      const userCredential = await signInWithEmailAndPassword(authInstance, email, password);
      
      // 2. Obtener token de autenticación
      const idToken = await userCredential.user.getIdToken();
      
      // 3. Obtener datos adicionales del usuario desde backend/Firestore
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/auth/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${idToken}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al obtener datos del usuario');
      }

      return {
        user: data.user,
        token: idToken
      };
    } catch (error) {
      throw error;
    }
  },

  // Cerrar sesión
  logout: async () => {
    try {
      const authInstance = getAuthSafe();
      await signOut(authInstance);
    } catch (error) {
      throw error;
    }
  },

  // Verificar usuario actual
  getCurrentUser: () => {
    return auth.currentUser;
  },

  // Obtener token del usuario actual
  getIdToken: async () => {
    if (auth.currentUser) {
      return await auth.currentUser.getIdToken();
    }
    return null;
  }
};

export default authService;
