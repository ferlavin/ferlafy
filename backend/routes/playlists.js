import express from 'express';
import { db } from '../config/firebase.js';
import { verifyFirebaseToken } from './auth.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Obtener todas las playlists del usuario
router.get('/', verifyFirebaseToken, async (req, res) => {
  try {
    const playlistsSnapshot = await db
      .collection('playlists')
      .where('userId', '==', req.userId)
      .get();

    const playlists = [];
    for (const doc of playlistsSnapshot.docs) {
      const playlist = doc.data();
      
      // Contar canciones en la playlist
      const songsCount = await db
        .collection('playlists')
        .doc(doc.id)
        .collection('songs')
        .count()
        .get();

      playlists.push({
        id: doc.id,
        ...playlist,
        createdAt: playlist.createdAt?.toDate?.() || new Date(),
        total_canciones: songsCount.data().count
      });
    }

    // Ordenar por createdAt en JavaScript (para evitar índice compuesto)
    playlists.sort((a, b) => b.createdAt - a.createdAt);

    res.json(playlists);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error al obtener playlists' });
  }
});

// Obtener una playlist con sus canciones
router.get('/:id', verifyFirebaseToken, async (req, res) => {
  try {
    const playlistDoc = await db.collection('playlists').doc(req.params.id).get();

    if (!playlistDoc.exists || playlistDoc.data().userId !== req.userId) {
      return res.status(404).json({ error: 'Playlist no encontrada' });
    }

    const playlist = {
      id: playlistDoc.id,
      ...playlistDoc.data()
    };

    // Obtener canciones de la playlist
    const songsSnapshot = await db
      .collection('playlists')
      .doc(req.params.id)
      .collection('songs')
      .orderBy('orden', 'asc')
      .get();

    // Leer songs.json para obtener info completa de las canciones
    const songsPath = path.join(__dirname, '../data/songs.json');
    const data = await fs.readFile(songsPath, 'utf-8');
    const allSongs = JSON.parse(data);

    // Mapear las canciones con su info completa
    const songs = songsSnapshot.docs
      .map(doc => {
        const songRef = doc.data();
        const song = allSongs.find(s => s.id === songRef.cancionId);
        return song ? { ...song, orden: songRef.orden } : null;
      })
      .filter(s => s !== null);

    playlist.canciones = songs;

    res.json(playlist);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error al obtener playlist' });
  }
});

// Crear nueva playlist
router.post('/', verifyFirebaseToken, async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;

    if (!nombre) {
      return res.status(400).json({ error: 'El nombre es requerido' });
    }

    const newPlaylist = {
      nombre,
      descripcion: descripcion || '',
      userId: req.userId,
      createdAt: new Date()
    };

    const docRef = await db.collection('playlists').add(newPlaylist);

    res.json({
      success: true,
      message: 'Playlist creada exitosamente',
      playlist: {
        id: docRef.id,
        ...newPlaylist
      }
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error al crear playlist' });
  }
});

// Agregar canción a playlist
router.post('/:id/songs', verifyFirebaseToken, async (req, res) => {
  try {
    const { cancionId } = req.body;

    // Verificar que la playlist pertenece al usuario
    const playlistDoc = await db.collection('playlists').doc(req.params.id).get();

    if (!playlistDoc.exists || playlistDoc.data().userId !== req.userId) {
      return res.status(404).json({ error: 'Playlist no encontrada' });
    }

    // Verificar si la canción ya está en la playlist
    const existingQuery = await db
      .collection('playlists')
      .doc(req.params.id)
      .collection('songs')
      .where('cancionId', '==', cancionId)
      .limit(1)
      .get();

    if (!existingQuery.empty) {
      return res.status(400).json({ error: 'La canción ya está en la playlist' });
    }

    // Obtener el orden máximo actual
    const maxOrderSnapshot = await db
      .collection('playlists')
      .doc(req.params.id)
      .collection('songs')
      .orderBy('orden', 'desc')
      .limit(1)
      .get();

    const newOrder = maxOrderSnapshot.empty ? 1 : maxOrderSnapshot.docs[0].data().orden + 1;

    await db
      .collection('playlists')
      .doc(req.params.id)
      .collection('songs')
      .add({
        cancionId,
        orden: newOrder
      });

    res.json({
      success: true,
      message: 'Canción agregada a la playlist'
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error al agregar canción' });
  }
});

// Eliminar canción de playlist
router.delete('/:id/songs/:cancionId', verifyFirebaseToken, async (req, res) => {
  try {
    // Verificar que la playlist pertenece al usuario
    const playlistDoc = await db.collection('playlists').doc(req.params.id).get();

    if (!playlistDoc.exists || playlistDoc.data().userId !== req.userId) {
      return res.status(404).json({ error: 'Playlist no encontrada' });
    }

    // Buscar y eliminar la canción
    const songQuery = await db
      .collection('playlists')
      .doc(req.params.id)
      .collection('songs')
      .where('cancionId', '==', parseInt(req.params.cancionId))
      .get();

    if (songQuery.empty) {
      return res.status(404).json({ error: 'Canción no encontrada en la playlist' });
    }

    await db
      .collection('playlists')
      .doc(req.params.id)
      .collection('songs')
      .doc(songQuery.docs[0].id)
      .delete();

    res.json({
      success: true,
      message: 'Canción eliminada de la playlist'
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error al eliminar canción' });
  }
});

// Eliminar playlist
router.delete('/:id', verifyFirebaseToken, async (req, res) => {
  try {
    const playlistDoc = await db.collection('playlists').doc(req.params.id).get();

    if (!playlistDoc.exists || playlistDoc.data().userId !== req.userId) {
      return res.status(404).json({ error: 'Playlist no encontrada' });
    }

    // Eliminar todas las canciones de la playlist primero
    const songsSnapshot = await db
      .collection('playlists')
      .doc(req.params.id)
      .collection('songs')
      .get();

    for (const doc of songsSnapshot.docs) {
      await doc.ref.delete();
    }

    // Eliminar la playlist
    await db.collection('playlists').doc(req.params.id).delete();

    res.json({
      success: true,
      message: 'Playlist eliminada'
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error al eliminar playlist' });
  }
});

export default router;