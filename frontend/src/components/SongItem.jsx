import { Play, Pause, Trash2, ListPlus } from 'lucide-react';
import { useState, useEffect } from 'react';
import apiService from '../services/apiService';

function SongItem({ song, onClick, isActive, onDelete }) {
  const [showActions, setShowActions] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    if (showPlaylistModal) {
      fetchPlaylists();
    }
  }, [showPlaylistModal]);

  const fetchPlaylists = async () => {
    try {
      const data = await apiService.getPlaylists();
      setPlaylists(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleAddToPlaylist = async (playlistId) => {
    try {
      await apiService.addSongToPlaylist(playlistId, song.id);
      alert(`"${song.title}" agregada a la playlist`);
      setShowPlaylistModal(false);
    } catch (error) {
      console.error('Error:', error);
      alert(error.message || 'Error al agregar canción');
    }
  };

  const handleDelete = async (e) => {
    e.stopPropagation(); // Evitar que se reproduzca la canción al eliminar
    
    if (!window.confirm(`¿Estás seguro de eliminar "${song.title}"?`)) {
      return;
    }

    setDeleting(true);
    
    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
      const response = await fetch(`${baseUrl}/songs/${song.id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        if (onDelete) {
          onDelete(song.id);
        }
      } else {
        alert('Error al eliminar la canción');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al eliminar la canción');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div 
      onClick={() => onClick(song)}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      style={{
        background: '#181818',
        padding: '1rem',
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'all 0.3s',
        border: isActive ? '2px solid #1DB954' : '2px solid transparent',
        position: 'relative'
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.background = '#282828';
        e.currentTarget.style.transform = 'translateY(-4px)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.background = '#181818';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {/* Botones de acción */}
      {showActions && !deleting && (
        <div style={{
          position: 'absolute',
          top: '0.5rem',
          right: '0.5rem',
          display: 'flex',
          gap: '0.5rem',
          zIndex: 10
        }}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowPlaylistModal(true);
            }}
            style={{
              background: '#1DB954',
              border: 'none',
              borderRadius: '50%',
              padding: '0.5rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = '#1ed760';
              e.currentTarget.style.transform = 'scale(1.1)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = '#1DB954';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <ListPlus size={16} color="white" />
          </button>

          <button
            onClick={handleDelete}
            style={{
              background: '#f44336',
              border: 'none',
              borderRadius: '50%',
              padding: '0.5rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = '#d32f2f';
              e.currentTarget.style.transform = 'scale(1.1)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = '#f44336';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <Trash2 size={16} color="white" />
          </button>
        </div>
      )}

      {deleting && (
        <div style={{
          position: 'absolute',
          top: '0.5rem',
          right: '0.5rem',
          color: '#f44336',
          fontSize: '0.75rem',
          fontWeight: 'bold'
        }}>
          Eliminando...
        </div>
      )}

      <div style={{
        position: 'relative',
        marginBottom: '1rem'
      }}>
        <img 
          src={song.cover} 
          alt={song.title}
          style={{
            width: '100%',
            aspectRatio: '1',
            objectFit: 'cover',
            borderRadius: '4px'
          }}
        />
        <div style={{
          position: 'absolute',
          bottom: '8px',
          right: '8px',
          background: '#1DB954',
          borderRadius: '50%',
          padding: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: isActive ? '1' : '0',
          transition: 'opacity 0.3s'
        }}>
          {isActive ? <Pause size={20} /> : <Play size={20} />}
        </div>
      </div>
      
      <h3 style={{
        fontSize: '1rem',
        marginBottom: '0.25rem',
        color: 'white',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
      }}>
        {song.title}
      </h3>
      
      <p style={{
        fontSize: '0.875rem',
        color: '#b3b3b3'
      }}>
        {song.artist}
      </p>

      {/* Modal de selección de playlist */}
      {showPlaylistModal && (
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
          onClick={(e) => {
            e.stopPropagation();
            setShowPlaylistModal(false);
          }}
        >
          <div
            style={{
              background: '#282828',
              padding: '2rem',
              borderRadius: '12px',
              maxWidth: '500px',
              width: '90%',
              maxHeight: '70vh',
              overflow: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
              Agregar a Playlist
            </h3>
            <p style={{ color: '#b3b3b3', marginBottom: '1.5rem' }}>
              {song.title}
            </p>

            {playlists.length === 0 ? (
              <p style={{ color: '#b3b3b3', textAlign: 'center', padding: '2rem' }}>
                No tenés playlists. Creá una primero.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {playlists.map(playlist => (
                  <button
                    key={playlist.id}
                    onClick={() => handleAddToPlaylist(playlist.id)}
                    style={{
                      background: '#181818',
                      border: '2px solid #404040',
                      padding: '1rem',
                      borderRadius: '8px',
                      color: 'white',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = '#1DB954';
                      e.currentTarget.style.borderColor = '#1DB954';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = '#181818';
                      e.currentTarget.style.borderColor = '#404040';
                    }}
                  >
                    <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>
                      {playlist.nombre}
                    </div>
                    {playlist.descripcion && (
                      <div style={{ fontSize: '0.875rem', color: '#b3b3b3' }}>
                        {playlist.descripcion}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}

            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowPlaylistModal(false);
              }}
              style={{
                marginTop: '1.5rem',
                width: '100%',
                background: '#404040',
                border: 'none',
                padding: '0.75rem',
                borderRadius: '8px',
                color: 'white',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SongItem;