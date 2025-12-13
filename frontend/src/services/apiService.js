import authService from './authService';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Función helper para obtener el token
const getAuthHeader = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No hay token de autenticación');
  }
  
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

export const apiService = {
  // Playlists
  getPlaylists: async () => {
    const headers = await getAuthHeader();
    const response = await fetch(`${API_BASE_URL}/playlists`, { headers });
    if (!response.ok) throw new Error('Error al obtener playlists');
    return response.json();
  },

  getPlaylist: async (id) => {
    const headers = await getAuthHeader();
    const response = await fetch(`${API_BASE_URL}/playlists/${id}`, { headers });
    if (!response.ok) throw new Error('Playlist no encontrada');
    return response.json();
  },

  createPlaylist: async (nombre, descripcion = '') => {
    const headers = await getAuthHeader();
    const response = await fetch(`${API_BASE_URL}/playlists`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ nombre, descripcion })
    });
    if (!response.ok) throw new Error('Error al crear playlist');
    return response.json();
  },

  deletePlaylist: async (id) => {
    const headers = await getAuthHeader();
    const response = await fetch(`${API_BASE_URL}/playlists/${id}`, {
      method: 'DELETE',
      headers
    });
    if (!response.ok) throw new Error('Error al eliminar playlist');
    return response.json();
  },

  addSongToPlaylist: async (playlistId, cancionId) => {
    const headers = await getAuthHeader();
    const response = await fetch(`${API_BASE_URL}/playlists/${playlistId}/songs`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ cancionId })
    });
    if (!response.ok) throw new Error('Error al agregar canción');
    return response.json();
  },

  removeSongFromPlaylist: async (playlistId, cancionId) => {
    const headers = await getAuthHeader();
    const response = await fetch(`${API_BASE_URL}/playlists/${playlistId}/songs/${cancionId}`, {
      method: 'DELETE',
      headers
    });
    if (!response.ok) throw new Error('Error al eliminar canción');
    return response.json();
  },

  // Songs
  getSongs: async () => {
    const response = await fetch(`${API_BASE_URL}/songs`);
    if (!response.ok) throw new Error('Error al obtener canciones');
    return response.json();
  },

  getSong: async (id) => {
    const response = await fetch(`${API_BASE_URL}/songs/${id}`);
    if (!response.ok) throw new Error('Canción no encontrada');
    return response.json();
  },

  deleteSong: async (id) => {
    const headers = await getAuthHeader();
    const response = await fetch(`${API_BASE_URL}/songs/${id}`, {
      method: 'DELETE',
      headers
    });
    if (!response.ok) throw new Error('Error al eliminar canción');
    return response.json();
  },

  // Contact
  sendMessage: async (name, email, message) => {
    const headers = await getAuthHeader();
    const response = await fetch(`${API_BASE_URL}/contact`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ name, email, message })
    });
    if (!response.ok) throw new Error('Error al enviar mensaje');
    return response.json();
  },

  // Messages
  getMessages: async () => {
    const headers = await getAuthHeader();
    const response = await fetch(`${API_BASE_URL}/contact`, { headers });
    if (!response.ok) throw new Error('Error al obtener mensajes');
    return response.json();
  },

  deleteMessage: async (id) => {
    const headers = await getAuthHeader();
    const response = await fetch(`${API_BASE_URL}/contact/${id}`, {
      method: 'DELETE',
      headers
    });
    if (!response.ok) throw new Error('Error al eliminar mensaje');
    return response.json();
  },

  // Upload
  uploadSong: async (formData) => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No hay token de autenticación');

    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });
    if (!response.ok) throw new Error('Error al subir canción');
    return response.json();
  }
};

export default apiService;
