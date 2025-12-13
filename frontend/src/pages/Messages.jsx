import { useState, useEffect } from 'react';
import { Mail, Trash2, Clock, User } from 'lucide-react';
import apiService from '../services/apiService';

function Messages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const data = await apiService.getMessages();
      setMessages(data);
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este mensaje?')) return;
    
    try {
      await apiService.deleteMessage(id);
      setMessages(messages.filter(m => m.id !== id));
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
        Cargando mensajes...
      </div>
    );
  }

  return (
    <div style={{
      maxWidth: '900px',
      margin: '0 auto',
      padding: '3rem 2rem'
    }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
          Mensajes de Contacto
        </h1>
        <p style={{ color: '#b3b3b3', fontSize: '1.1rem' }}>
          {messages.length} {messages.length === 1 ? 'mensaje' : 'mensajes'} recibidos
        </p>
      </div>

      {messages.length === 0 ? (
        <div style={{
          background: '#181818',
          padding: '3rem',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <Mail size={48} style={{ color: '#666', marginBottom: '1rem' }} />
          <p style={{ color: '#b3b3b3', fontSize: '1.1rem' }}>
            No hay mensajes todavía
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {messages.map(msg => (
            <div 
              key={msg.id}
              style={{
                background: msg.read ? '#181818' : '#1a2a1a',
                padding: '1.5rem',
                borderRadius: '8px',
                border: msg.read ? '1px solid #282828' : '1px solid #1DB954',
                position: 'relative'
              }}
            >
              {!msg.read && (
                <div style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  background: '#1DB954',
                  color: 'white',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                  fontWeight: 'bold'
                }}>
                  NUEVO
                </div>
              )}

              <div style={{ 
                display: 'flex', 
                alignItems: 'center',
                gap: '1rem',
                marginBottom: '1rem'
              }}>
                <div style={{
                  background: '#282828',
                  padding: '0.75rem',
                  borderRadius: '50%',
                  display: 'flex'
                }}>
                  <User size={20} style={{ color: '#1DB954' }} />
                </div>
                
                <div style={{ flex: 1 }}>
                  <h3 style={{ 
                    fontSize: '1.2rem', 
                    marginBottom: '0.25rem',
                    color: 'white'
                  }}>
                    {msg.name}
                  </h3>
                  <p style={{ 
                    fontSize: '0.875rem', 
                    color: '#b3b3b3' 
                  }}>
                    {msg.email}
                  </p>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  color: '#b3b3b3',
                  fontSize: '0.875rem'
                }}>
                  <Clock size={16} />
                  {formatDate(msg.date)}
                </div>
              </div>

              <div style={{
                background: '#282828',
                padding: '1rem',
                borderRadius: '4px',
                marginBottom: '1rem'
              }}>
                <p style={{ 
                  color: '#e0e0e0',
                  lineHeight: '1.6',
                  whiteSpace: 'pre-wrap'
                }}>
                  {msg.message}
                </p>
              </div>

              <div style={{ 
                display: 'flex', 
                gap: '1rem',
                justifyContent: 'flex-end'
              }}>
                {!msg.read && (
                  <button
                    onClick={() => handleMarkAsRead(msg.id)}
                    style={{
                      background: '#1DB954',
                      color: 'white',
                      border: 'none',
                      padding: '0.5rem 1rem',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                      fontWeight: 'bold'
                    }}
                  >
                    Marcar como leído
                  </button>
                )}
                
                <button
                  onClick={() => handleDelete(msg.id)}
                  style={{
                    background: '#f44336',
                    color: 'white',
                    border: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <Trash2 size={16} />
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Messages;