import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import songsRoutes from './routes/songs.js';
import contactRoutes from './routes/contact.js';
import uploadRoutes from './routes/upload.js';
import authRoutes from './routes/auth.js';
import playlistsRoutes from './routes/playlists.js';

dotenv.config();

const app = express();
const PORT = 3000;

// Configuración de CORS para producción
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'https://ferlafy.vercel.app'
  ],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

app.use('/api/songs', songsRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/auth', authRoutes);

app.use('/api/playlists', playlistsRoutes);


app.get('/', (req, res) => {
  res.json({ message: 'Mini Spotify API funcionando!' });
});

app.listen(PORT, () => {
  console.log(`🎵 Servidor corriendo en http://localhost:${PORT}`);
});