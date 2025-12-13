import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Music, Mail, Lock, User } from 'lucide-react';
import authService from '../services/authService';
import { auth } from '../config/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';

function Register({ setIsAuthenticated, setUser }) {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmPassword: ''
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

    // Validaciones
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      setLoading(false);
      return;
    }

    try {
      const result = await authService.register(
        formData.email,
        formData.password,
        formData.nombre
      );
      
      localStorage.setItem('token', result.token);
      localStorage.setItem('user', JSON.stringify(result.user));
      setIsAuthenticated(true);
      setUser(result.user);
      navigate('/');
    } catch (error) {
      setError(error.message || 'Error al registrarse');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTestFirebaseRegister = async () => {
    try {
      setLoading(true);
      setError('');
      const testEmail = `test+${Date.now()}@example.com`;
      const testPassword = '123456';
      const cred = await createUserWithEmailAndPassword(auth, testEmail, testPassword);
      console.log('[test] createUserWithEmailAndPassword OK', cred.user.uid, cred.user.email);
      setError(`Prueba OK: ${cred.user.email}`);
    } catch (err) {
      console.error('[test] error createUserWithEmailAndPassword', err);
      setError(err?.message || 'Error en prueba de Firebase Auth');
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
            Crear Cuenta
          </h1>
          <p style={{ color: '#b3b3b3' }}>
            Unite a Fermusic
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
              Nombre
            </label>
            <div style={{ position: 'relative' }}>
              <User size={20} style={{
                position: 'absolute',
                left: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#b3b3b3'
              }} />
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
                placeholder="Tu nombre"
                style={{
                  ...inputStyle,
                  paddingLeft: '3rem'
                }}
              />
            </div>
          </div>

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

          <div style={{ marginBottom: '1.5rem' }}>
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
                placeholder="Mínimo 6 caracteres"
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
              Confirmar Contraseña
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
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Repetí tu contraseña"
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
            {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
          </button>

          <button
            type="button"
            onClick={handleTestFirebaseRegister}
            disabled={loading}
            style={{
              width: '100%',
              background: '#2d7dd2',
              color: 'white',
              border: 'none',
              padding: '0.75rem',
              borderRadius: '12px',
              fontSize: '0.95rem',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginBottom: '1rem'
            }}
          >
            Probar registro directo (Firebase)
          </button>

          <p style={{ textAlign: 'center', color: '#b3b3b3' }}>
            ¿Ya tenés cuenta?{' '}
            <Link to="/login" style={{ color: '#1DB954', textDecoration: 'none', fontWeight: 'bold' }}>
              Iniciá sesión
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

export default Register;