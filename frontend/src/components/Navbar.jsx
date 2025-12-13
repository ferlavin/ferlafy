import { Link } from 'react-router-dom';
import { Music, LogOut, User } from 'lucide-react';

function Navbar({ user, onLogout }) {
  return (
    <nav style={{
      background: 'rgba(0, 0, 0, 0.9)',
      padding: '1rem 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: '1px solid #282828'
    }}>
      <Link to="/" style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        color: '#1DB954',
        textDecoration: 'none',
        fontSize: '1.5rem',
        fontWeight: 'bold'
      }}>
        <Music size={32} />
        <span>Fermusic</span>
      </Link>

      <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
        <Link to="/" style={linkStyle}>Inicio</Link>
        <Link to="/about" style={linkStyle}>Acerca de</Link>
        <Link to="/contact" style={linkStyle}>Contacto</Link>
        <Link to="/upload" style={linkStyle}>Subir</Link>
        <Link to="/messages" style={linkStyle}>Mensajes</Link>
        <Link to="/playlists" style={linkStyle}>Playlists</Link>   
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          marginLeft: '1rem',
          paddingLeft: '1rem',
          borderLeft: '1px solid #404040'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: '#b3b3b3'
          }}>
            <User size={18} />
            <span style={{ fontSize: '0.9rem' }}>{user?.nombre}</span>
          </div>

          <button
            onClick={onLogout}
            style={{
              background: 'transparent',
              border: '1px solid #f44336',
              color: '#f44336',
              padding: '0.5rem 1rem',
              borderRadius: '20px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.9rem',
              fontWeight: '500',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => {
              e.target.style.background = '#f44336';
              e.target.style.color = 'white';
            }}
            onMouseOut={(e) => {
              e.target.style.background = 'transparent';
              e.target.style.color = '#f44336';
            }}
          >
            <LogOut size={16} />
            Salir
          </button>
        </div>
      </div>
    </nav>
  );
}

const linkStyle = {
  color: '#b3b3b3',
  textDecoration: 'none',
  fontSize: '1rem',
  fontWeight: '500',
  transition: 'color 0.3s',
};

export default Navbar;