import express from 'express';
import multer from 'multer';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Configurar multer para guardar archivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Guardar en frontend/public/music
    const uploadPath = path.join(__dirname, '../../frontend/public/music');
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Generar nombre único para evitar conflictos
    const uniqueName = Date.now() + '-' + file.originalname.replace(/\s+/g, '_');
    cb(null, uniqueName);
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    // Solo aceptar archivos MP3
    if (file.mimetype === 'audio/mpeg' || file.mimetype === 'audio/mp3') {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos MP3'));
    }
  }
});

router.post('/', upload.single('audioFile'), async (req, res) => {
  try {
    const { title, artist, coverUrl } = req.body;
    const audioFile = req.file;

    if (!audioFile) {
      return res.status(400).json({ error: 'No se recibió archivo de audio' });
    }

    // Leer songs.json
    const songsPath = path.join(__dirname, '../data/songs.json');
    const data = await fs.readFile(songsPath, 'utf-8');
    const songs = JSON.parse(data);

    // Crear nueva canción
    const newSong = {
      id: songs.length > 0 ? Math.max(...songs.map(s => s.id)) + 1 : 1,
      title: title,
      artist: artist,
      duration: '0:00', // Se podría calcular con una librería
      file: `/music/${audioFile.filename}`,
      cover: coverUrl || 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300'
    };

    // Agregar a la lista
    songs.push(newSong);

    // Guardar en songs.json
    await fs.writeFile(songsPath, JSON.stringify(songs, null, 2));

    res.json({ 
      success: true, 
      message: 'Canción subida exitosamente',
      song: newSong
    });

  } catch (error) {
    console.error('Error al subir canción:', error);
    res.status(500).json({ error: 'Error al subir la canción' });
  }
});

export default router;