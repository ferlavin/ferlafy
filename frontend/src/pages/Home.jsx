import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import SongList from '../components/SongList';
import apiService from '../services/apiService';

function Home({ setCurrentSong, setIsPlaying, currentSong, songs, setSongs }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredSongs, setFilteredSongs] = useState([]);

  useEffect(() => {
    // Recargar canciones cuando volvemos a Home
    const fetchSongs = async () => {
      try {
        const data = await apiService.getSongs();
        setSongs(data);
        setFilteredSongs(data);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchSongs();
  }, [setSongs]);

  useEffect(() => {
    // Filtrar canciones cuando cambia el término de búsqueda
    if (searchTerm.trim() === '') {
      setFilteredSongs(songs);
    } else {
      const filtered = songs.filter(song => 
        song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        song.artist.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredSongs(filtered);
    }
  }, [searchTerm, songs]);

  const handleSongClick = (song) => {
    setCurrentSong(song);
    setIsPlaying(true);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
  };

  const handleDelete = (songId) => {
    // Actualizar la lista de canciones
    const updatedSongs = songs.filter(s => s.id !== songId);
    setSongs(updatedSongs);
    setFilteredSongs(updatedSongs.filter(song => 
      song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchTerm.toLowerCase())
    ));

    // Si la canción eliminada es la que está sonando, detenerla
    if (currentSong && currentSong.id === songId) {
      setCurrentSong(null);
      setIsPlaying(false);
    }
  };

  if (songs.length === 0) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '60vh',
        fontSize: '1.5rem'
      }}>
        Cargando canciones...
      </div>
    );
  }

  return (
    <div>
      <div style={{ padding: '2rem 2rem 0 2rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
          Bienvenido a Fermusic
        </h1>
        <p style={{ color: '#b3b3b3', marginBottom: '1.5rem' }}>
          Escuchá tu música favorita
        </p>

        {/* Buscador */}
        <div style={{
          position: 'relative',
          maxWidth: '600px',
          marginBottom: '1rem'
        }}>
          <div style={{
            position: 'absolute',
            left: '1rem',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#b3b3b3'
          }}>
            <Search size={20} />
          </div>
          
          <input
            type="text"
            placeholder="Buscar canciones o artistas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem 3rem 0.75rem 3rem',
              background: '#282828',
              border: '2px solid #404040',
              borderRadius: '24px',
              color: 'white',
              fontSize: '1rem',
              outline: 'none',
              transition: 'border-color 0.3s'
            }}
            onFocus={(e) => e.target.style.borderColor = '#1DB954'}
            onBlur={(e) => e.target.style.borderColor = '#404040'}
          />

          {searchTerm && (
            <button
              onClick={handleClearSearch}
              style={{
                position: 'absolute',
                right: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'transparent',
                border: 'none',
                color: '#b3b3b3',
                cursor: 'pointer',
                fontSize: '1.2rem',
                fontWeight: 'bold',
                padding: '0.25rem 0.5rem'
              }}
            >
              ✕
            </button>
          )}
        </div>

        {/* Resultados de búsqueda */}
        {searchTerm && (
          <p style={{ 
            color: '#b3b3b3', 
            fontSize: '0.9rem',
            marginBottom: '0.5rem'
          }}>
            {filteredSongs.length === 0 
              ? 'No se encontraron resultados'
              : `${filteredSongs.length} ${filteredSongs.length === 1 ? 'canción encontrada' : 'canciones encontradas'}`
            }
          </p>
        )}
      </div>
      
      {filteredSongs.length === 0 ? (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '40vh',
          padding: '2rem'
        }}>
          <Search size={64} style={{ color: '#666', marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
            No se encontraron canciones
          </h3>
          <p style={{ color: '#b3b3b3', textAlign: 'center' }}>
            Intentá buscar con otros términos
          </p>
          <button
            onClick={handleClearSearch}
            style={{
              marginTop: '1rem',
              background: '#1DB954',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '24px',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            Ver todas las canciones
          </button>
        </div>
      ) : (
        <SongList 
          songs={filteredSongs} 
          onSongClick={handleSongClick}
          currentSong={currentSong}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}

export default Home;