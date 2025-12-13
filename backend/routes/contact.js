import express from 'express';
import { db } from '../config/firebase.js';
import { verifyFirebaseToken } from './auth.js';

const router = express.Router();

// Enviar mensaje de contacto (guardado en Firestore)
router.post('/', verifyFirebaseToken, async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const userId = req.userId;
    
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    // Guardar mensaje en Firestore
    const newMessage = {
      userId,
      name,
      email,
      message,
      date: new Date(),
      read: false
    };

    const docRef = await db.collection('mensajes').add(newMessage);
    
    console.log('Mensaje de contacto guardado:', docRef.id);
    
    res.json({ 
      success: true, 
      message: 'Mensaje recibido correctamente',
      id: docRef.id
    });
  } catch (error) {
    console.error('Error al guardar mensaje:', error);
    res.status(500).json({ error: 'Error al guardar el mensaje' });
  }
});

// Obtener todos los mensajes (solo para admin o el usuario mismo)
router.get('/', verifyFirebaseToken, async (req, res) => {
  try {
    // Obtener solo mensajes del usuario autenticado
    const messagesSnapshot = await db
      .collection('mensajes')
      .where('userId', '==', req.userId)
      .orderBy('date', 'desc')
      .get();

    const messages = messagesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date.toDate().toISOString()
    }));

    res.json(messages);
  } catch (error) {
    console.error('Error al obtener mensajes:', error);
    res.status(500).json({ error: 'Error al obtener mensajes' });
  }
});

// Marcar mensaje como leído
router.patch('/:id/read', verifyFirebaseToken, async (req, res) => {
  try {
    const messageDoc = await db.collection('mensajes').doc(req.params.id).get();

    if (!messageDoc.exists) {
      return res.status(404).json({ error: 'Mensaje no encontrado' });
    }

    // Verificar que el mensaje pertenece al usuario
    if (messageDoc.data().userId !== req.userId) {
      return res.status(403).json({ error: 'No autorizado' });
    }

    await db.collection('mensajes').doc(req.params.id).update({
      read: true
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Error al actualizar mensaje:', error);
    res.status(500).json({ error: 'Error al actualizar mensaje' });
  }
});

// Eliminar mensaje
router.delete('/:id', verifyFirebaseToken, async (req, res) => {
  try {
    const messageDoc = await db.collection('mensajes').doc(req.params.id).get();

    if (!messageDoc.exists) {
      return res.status(404).json({ error: 'Mensaje no encontrado' });
    }

    // Verificar que el mensaje pertenece al usuario
    if (messageDoc.data().userId !== req.userId) {
      return res.status(403).json({ error: 'No autorizado' });
    }

    await db.collection('mensajes').doc(req.params.id).delete();
    
    res.json({ success: true, message: 'Mensaje eliminado' });
  } catch (error) {
    console.error('Error al eliminar mensaje:', error);
    res.status(500).json({ error: 'Error al eliminar mensaje' });
  }
});

export default router;  