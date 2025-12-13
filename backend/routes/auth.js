import express from 'express';
import { auth, db } from '../config/firebase.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Middleware para verificar token Firebase (definido primero)
const verifyFirebaseToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'No autorizado' });
    }

    const decodedToken = await auth.verifyIdToken(token);
    req.userId = decodedToken.uid;
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Error verificando token:', error);
    res.status(401).json({ error: 'Token inválido o expirado' });
  }
};

// Registro - solo guarda en Firestore (el usuario ya fue creado en Firebase Auth por el frontend)
router.post('/register', verifyFirebaseToken, async (req, res) => {
  try {
    const { nombre, email } = req.body;
    const userId = req.userId; // Ya viene del token verificado

    // Validar datos
    if (!nombre || !email) {
      return res.status(400).json({ error: 'Nombre y email son requeridos' });
    }

    // Guardar información en Firestore
    await db.collection('usuarios').doc(userId).set({
      nombre,
      email,
      createdAt: new Date(),
      userId
    });

    res.json({
      success: true,
      message: 'Usuario registrado exitosamente',
      user: {
        id: userId,
        nombre,
        email
      }
    });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
});

// Obtener datos del usuario autenticado (reemplaza el login)
router.get('/me', verifyFirebaseToken, async (req, res) => {
  try {
    const userId = req.userId;

    // Obtener datos del usuario desde Firestore
    const userDoc = await db.collection('usuarios').doc(userId).get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: 'Usuario no encontrado en la base de datos' });
    }

    const userData = userDoc.data();

    res.json({
      success: true,
      user: {
        id: userId,
        nombre: userData.nombre,
        email: userData.email
      }
    });
  } catch (error) {
    console.error('Error obteniendo usuario:', error);
    res.status(500).json({ error: 'Error al obtener datos del usuario' });
  }
});

// Login - OBSOLETO, ahora el frontend hace signInWithEmailAndPassword directamente

// Verificar token y obtener datos del usuario
router.get('/verify', verifyFirebaseToken, async (req, res) => {
  try {
    const userDoc = await db.collection('usuarios').doc(req.userId).get();
    
    if (!userDoc.exists) {
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }

    const userData = userDoc.data();

    res.json({
      success: true,
      user: {
        id: req.userId,
        nombre: userData.nombre,
        email: userData.email
      }
    });
  } catch (error) {
    console.error('Error en verify:', error);
    res.status(500).json({ error: 'Error al verificar usuario' });
  }
});

export { verifyFirebaseToken };
export default router;