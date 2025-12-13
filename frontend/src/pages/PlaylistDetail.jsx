import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Trash2, Plus } from 'lucide-react';
import apiService from '../services/apiService';

function PlaylistDetail({ setCurrentSong, setIsPlaying, currentSong }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [playlist, setPlaylist] = useState(null);
  const [allSongs, setAllSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    fetchPlaylist();
    fetchAllSongs();
  }, [id]);

  const fetchPlaylist = async () => {
    try {
      const data = await apiService.getPlaylist(id);
      setPlaylist(data);
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  const fetchAllSongs = async () => {
    try {
      const data = await apiService.getSongs();
      setAllSongs(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleAddSong = async (cancionId) => {
    try {
      await apiService.addSongToPlaylist(id, cancionId);
      fetchPlaylist();
      setShowAddModal(false);
    } catch (error) {
      console.error('Error:', error);
      alert(error.message);
    }
  };

  const handleRemoveSong = async (cancionId) => {
    if (!window.confirm('¿Eliminar esta canción de la playlist?')) return;

    try {
      await apiService.removeSongFromPlaylist(id, cancionId);
      fetchPlaylist();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handlePlaySong = (song) => {
    setCurrentSong(song);
    setIsPlaying(true);
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '60vh',
        fontSize: '1.5rem'
      }}>
        Cargando playlist...
      </div>
    );
  }

  if (!playlist) {
    return (
      <div style={{ padding: '2rem' }}>
        <p>Playlist no encontrada</p>
      </div>
    );
  }

  const availableSongs = allSongs.filter(
    song => !playlist.canciones.some(ps => ps.id === song.id)
  );

  return (
    <div style={{ padding: '2rem' }}>
      {/* Header */}
      <button
        onClick={() => navigate('/playlists')}
        style={{
          background: 'transparent',
          border: 'none',
          color: '#b3b3b3',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '1rem',
          marginBottom: '2rem',
          padding: '0.5rem',
          transition: 'color 0.2s'
        }}
        onMouseOver={(e) => e.target.style.color = 'white'}
        onMouseOut={(e) => e.target.style.color = '#b3b3b3'}
      >
        <ArrowLeft size={20} />
        Volver a playlists
      </button>

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '2rem'
      }}>
        <div>
          <h1 style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>
            {playlist.nombre}
          </h1>
          {playlist.descripcion && (
            <p style={{ color: '#b3b3b3', fontSize: '1.1rem', marginBottom: '0.5rem' }}>
              {playlist.descripcion}
            </p>
          )}
          <p style={{ color: '#b3b3b3', fontSize: '0.9rem' }}>
            {playlist.canciones.length} {playlist.canciones.length === 1 ? 'canción' : 'canciones'}
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          style={{
            background: '#1DB954',
            color: 'white',
            border: 'none',
            padding: '0.75rem 1.5rem',
            borderRadius: '24px',
            fontSize: '1rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <Plus size={20} />
          Agregar Canción
        </button>
      </div>

      {/* Lista de canciones */}
      {playlist.canciones.length === 0 ? (
        <div style={{
          background: '#181818',
          padding: '3rem',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <p style={{ color: '#b3b3b3', fontSize: '1.1rem', marginBottom: '1rem' }}>
            Esta playlist está vacía
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            style={{
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
            Agregar tu primera canción
          </button>
        </div>
      ) : (
        <div style={{ background: '#181818', borderRadius: '8px', overflow: 'hidden' }}>
          {playlist.canciones.map((song, index) => (
            <div
              key={song.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '1rem',
                borderBottom: index < playlist.canciones.length - 1 ? '1px solid #282828' : 'none',
                transition: 'background 0.2s',
                cursor: 'pointer'
              }}
              onMouseOver={(e) => e.currentTarget.style.background = '#282828'}
              onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <div style={{
                width: '40px',
                textAlign: 'center',
                color: '#b3b3b3',
                marginRight: '1rem'
              }}>
                {index + 1}
              </div>

              <img
                src={song.cover}
                alt={song.title}
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '4px',
                  marginRight: '1rem'
                }}
              />

              <div style={{ flex: 1 }} onClick={() => handlePlaySong(song)}>
                <div style={{
                  fontWeight: currentSong?.id === song.id ? 'bold' : 'normal',
                  color: currentSong?.id === song.id ? '#1DB954' : 'white',
                  marginBottom: '0.25rem'
                }}>
                  {song.title}
                </div>
                <div style={{ fontSize: '0.875rem', color: '#b3b3b3' }}>
                  {song.artist}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePlaySong(song);
                  }}
                  style={{
                    background: currentSong?.id === song.id ? '#1DB954' : '#282828',
                    border: 'none',
                    borderRadius: '50%',
                    padding: '0.75rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Play size={18} color="white" />
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveSong(song.id);
                  }}
                  style={{
                    background: '#282828',
                    border: 'none',
                    borderRadius: '50%',
                    padding: '0.75rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Trash2 size={18} color="#f44336" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal para agregar canciones */}
      {showAddModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}
          onClick={() => setShowAddModal(false)}
        >
          <div
            style={{
              background: '#282828',
              padding: '2rem',
              borderRadius: '12px',
              maxWidth: '600px',
              width: '90%',
              maxHeight: '80vh',
              overflow: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>
              Agregar Canciones
            </h2>

            {availableSongs.length === 0 ? (
              <p style={{ color: '#b3b3b3', textAlign: 'center', padding: '2rem' }}>
                Todas las canciones ya están en esta playlist
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {availableSongs.map(song => (
                  <div
                    key={song.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '1rem',
                      background: '#181818',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'background 0.2s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.background = '#202020'}
                    onMouseOut={(e) => e.currentTarget.style.background = '#181818'}
                    onClick={() => handleAddSong(song.id)}
                  >
                    <img
                      src={song.cover}
                      alt={song.title}
                      style={{
                        width: '50px',
                        height: '50px',
                        borderRadius: '4px',
                        marginRight: '1rem'
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>
                        {song.title}
                      </div>
                      <div style={{ fontSize: '0.875rem', color: '#b3b3b3' }}>
                        {song.artist}
                      </div>
                    </div>
                    <Plus size={24} style={{ color: '#1DB954' }} />
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={() => setShowAddModal(false)}
              style={{
                marginTop: '1.5rem',
                width: '100%',
                background: 'transparent',
                border: '1px solid #404040',
                color: 'white',
                padding: '0.75rem',
                borderRadius: '24px',
                fontSize: '1rem',
                cursor: 'pointer'
              }}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PlaylistDetail;