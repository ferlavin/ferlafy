    import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ListMusic, Plus, Trash2, Music } from 'lucide-react';
import apiService from '../services/apiService';

function Playlists() {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newPlaylist, setNewPlaylist] = useState({
    nombre: '',
    descripcion: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchPlaylists();
  }, []);

  const fetchPlaylists = async () => {
    try {
      const data = await apiService.getPlaylists();
      setPlaylists(data);
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await apiService.createPlaylist(newPlaylist.nombre, newPlaylist.descripcion);
      setShowModal(false);
      setNewPlaylist({ nombre: '', descripcion: '' });
      fetchPlaylists();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar esta playlist?')) return;

    try {
      await apiService.deletePlaylist(id);
      fetchPlaylists();
    } catch (error) {
      console.error('Error:', error);
    }
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
        Cargando playlists...
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem'
      }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
            Mis Playlists
          </h1>
          <p style={{ color: '#b3b3b3', fontSize: '1.1rem' }}>
            {playlists.length} {playlists.length === 1 ? 'playlist' : 'playlists'}
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
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
          Nueva Playlist
        </button>
      </div>

      {playlists.length === 0 ? (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '50vh',
          padding: '2rem'
        }}>
          <ListMusic size={64} style={{ color: '#666', marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
            No tenés playlists todavía
          </h3>
          <p style={{ color: '#b3b3b3', textAlign: 'center', marginBottom: '1.5rem' }}>
            Creá tu primera playlist y empezá a organizar tu música
          </p>
          <button
            onClick={() => setShowModal(true)}
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
            Crear Playlist
          </button>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: '1.5rem'
        }}>
          {playlists.map(playlist => (
            <div
              key={playlist.id}
              style={{
                background: '#181818',
                padding: '1.5rem',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.3s',
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
              onClick={() => navigate(`/playlists/${playlist.id}`)}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(playlist.id);
                }}
                style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  background: '#f44336',
                  border: 'none',
                  borderRadius: '50%',
                  padding: '0.5rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 10
                }}
              >
                <Trash2 size={16} color="white" />
              </button>

              <div style={{
                background: '#282828',
                width: '100%',
                aspectRatio: '1',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem'
              }}>
                <Music size={64} style={{ color: '#1DB954' }} />
              </div>

              <h3 style={{
                fontSize: '1.2rem',
                marginBottom: '0.5rem',
                color: 'white'
              }}>
                {playlist.nombre}
              </h3>

              {playlist.descripcion && (
                <p style={{
                  fontSize: '0.875rem',
                  color: '#b3b3b3',
                  marginBottom: '0.5rem',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {playlist.descripcion}
                </p>
              )}

              <p style={{
                fontSize: '0.875rem',
                color: '#b3b3b3'
              }}>
                {playlist.total_canciones || 0} {playlist.total_canciones === 1 ? 'canción' : 'canciones'}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Modal para crear playlist */}
      {showModal && (
        <div style={{
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
        onClick={() => setShowModal(false)}
        >
          <div
            style={{
              background: '#282828',
              padding: '2rem',
              borderRadius: '12px',
              maxWidth: '500px',
              width: '90%'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>
              Nueva Playlist
            </h2>

            <form onSubmit={handleCreate}>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  color: '#b3b3b3'
                }}>
                  Nombre *
                </label>
                <input
                  type="text"
                  value={newPlaylist.nombre}
                  onChange={(e) => setNewPlaylist({ ...newPlaylist, nombre: e.target.value })}
                  required
                  placeholder="Ej: Mis favoritas"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    background: '#181818',
                    border: '1px solid #404040',
                    borderRadius: '4px',
                    color: 'white',
                    fontSize: '1rem',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  color: '#b3b3b3'
                }}>
                  Descripción
                </label>
                <textarea
                  value={newPlaylist.descripcion}
                  onChange={(e) => setNewPlaylist({ ...newPlaylist, descripcion: e.target.value })}
                  placeholder="Describe tu playlist..."
                  rows="3"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    background: '#181818',
                    border: '1px solid #404040',
                    borderRadius: '4px',
                    color: 'white',
                    fontSize: '1rem',
                    outline: 'none',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div style={{
                display: 'flex',
                gap: '1rem',
                justifyContent: 'flex-end'
              }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{
                    background: 'transparent',
                    border: '1px solid #404040',
                    color: 'white',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '24px',
                    fontSize: '1rem',
                    cursor: 'pointer'
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  style={{
                    background: '#1DB954',
                    border: 'none',
                    color: 'white',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '24px',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  Crear
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Playlists;