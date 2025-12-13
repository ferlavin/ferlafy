import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Music, Mail, Lock } from 'lucide-react';
import authService from '../services/authService';

function Login({ setIsAuthenticated, setUser }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await authService.login(formData.email, formData.password);
      
      localStorage.setItem('token', result.token);
      localStorage.setItem('user', JSON.stringify(result.user));
      setIsAuthenticated(true);
      setUser(result.user);
      navigate('/');
    } catch (error) {
      setError(error.message || 'Error al iniciar sesión');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    }}>
      <div style={{
        background: '#181818',
        padding: '3rem',
        borderRadius: '12px',
        maxWidth: '450px',
        width: '100%'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Music size={48} style={{ color: '#1DB954', margin: '0 auto' }} />
          <h1 style={{ fontSize: '2rem', marginTop: '1rem', marginBottom: '0.5rem' }}>
            Iniciar Sesión
          </h1>
          <p style={{ color: '#b3b3b3' }}>
            Bienvenido a Fermusic
          </p>
        </div>

        {error && (
          <div style={{
            background: '#f44336',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '1.5rem',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              color: '#b3b3b3',
              fontSize: '0.9rem'
            }}>
              Email
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={20} style={{
                position: 'absolute',
                left: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#b3b3b3'
              }} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="tu@email.com"
                style={{
                  ...inputStyle,
                  paddingLeft: '3rem'
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              color: '#b3b3b3',
              fontSize: '0.9rem'
            }}>
              Contraseña
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={20} style={{
                position: 'absolute',
                left: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#b3b3b3'
              }} />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                style={{
                  ...inputStyle,
                  paddingLeft: '3rem'
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              background: loading ? '#666' : '#1DB954',
              color: 'white',
              border: 'none',
              padding: '1rem',
              borderRadius: '24px',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginBottom: '1rem'
            }}
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>

          <p style={{ textAlign: 'center', color: '#b3b3b3' }}>
            ¿No tenés cuenta?{' '}
            <Link to="/register" style={{ color: '#1DB954', textDecoration: 'none', fontWeight: 'bold' }}>
              Registrate
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '0.75rem',
  background: '#282828',
  border: '2px solid #404040',
  borderRadius: '8px',
  color: 'white',
  fontSize: '1rem',
  outline: 'none',
  transition: 'border-color 0.2s'
};

export default Login;