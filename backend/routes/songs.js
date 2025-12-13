import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

router.get('/', async (req, res) => {
  try {
    const data = await fs.readFile(path.join(__dirname, '../data/songs.json'), 'utf-8');
    const songs = JSON.parse(data);
    res.json(songs);
  } catch (error) {
    res.status(500).json({ error: 'Error al leer las canciones' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const data = await fs.readFile(path.join(__dirname, '../data/songs.json'), 'utf-8');
    const songs = JSON.parse(data);
    const song = songs.find(s => s.id === parseInt(req.params.id));
    
    if (song) {
      res.json(song);
    } else {
      res.status(404).json({ error: 'Canción no encontrada' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al leer la canción' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const songsPath = path.join(__dirname, '../data/songs.json');
    const data = await fs.readFile(songsPath, 'utf-8');
    let songs = JSON.parse(data);
    
    const songToDelete = songs.find(s => s.id === parseInt(req.params.id));
    
    if (!songToDelete) {
      return res.status(404).json({ error: 'Canción no encontrada' });
    }
    
    // Filtrar la canción a eliminar
    songs = songs.filter(s => s.id !== parseInt(req.params.id));
    
    // Guardar cambios
    await fs.writeFile(songsPath, JSON.stringify(songs, null, 2));
    
    // Opcional: Eliminar el archivo MP3 físico
    const musicFilePath = path.join(__dirname, '../../frontend/public', songToDelete.file);
    try {
      await fs.unlink(musicFilePath);
      console.log(`Archivo eliminado: ${songToDelete.file}`);
    } catch (error) {
      console.log('No se pudo eliminar el archivo de audio:', error.message);
    }
    
    res.json({ 
      success: true, 
      message: 'Canción eliminada correctamente' 
    });
  } catch (error) {
    console.error('Error al eliminar canción:', error);
    res.status(500).json({ error: 'Error al eliminar la canción' });
  }
});

export default router;