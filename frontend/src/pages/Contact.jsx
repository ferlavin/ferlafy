import { useState } from 'react';
import { Send } from 'lucide-react';
import apiService from '../services/apiService';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await apiService.sendMessage(formData.name, formData.email, formData.message);
      setSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setSubmitted(false), 3000);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div style={{
      maxWidth: '600px',
      margin: '0 auto',
      padding: '3rem 2rem'
    }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
        Contacto
      </h1>
      
      <p style={{ 
        color: '#b3b3b3', 
        fontSize: '1.1rem',
        marginBottom: '2rem' 
      }}>
        ¿Tenés alguna pregunta o sugerencia? ¡Escribinos!
      </p>

      {submitted && (
        <div style={{
          background: '#1DB954',
          padding: '1rem',
          borderRadius: '8px',
          marginBottom: '1rem',
          textAlign: 'center'
        }}>
          ¡Mensaje enviado con éxito!
        </div>
      )}

      <form onSubmit={handleSubmit} style={{
        background: '#181818',
        padding: '2rem',
        borderRadius: '8px'
      }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '0.5rem',
            color: '#b3b3b3' 
          }}>
            Nombre
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '0.5rem',
            color: '#b3b3b3' 
          }}>
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '0.5rem',
            color: '#b3b3b3' 
          }}>
            Mensaje
          </label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows="5"
            style={{...inputStyle, resize: 'vertical'}}
          />
        </div>

        <button
          type="submit"
          style={{
            background: '#1DB954',
            color: 'white',
            border: 'none',
            padding: '0.75rem 2rem',
            borderRadius: '24px',
            fontSize: '1rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            transition: 'all 0.2s'
          }}
          onMouseOver={(e) => e.target.style.background = '#1ed760'}
          onMouseOut={(e) => e.target.style.background = '#1DB954'}
        >
          <Send size={18} />
          Enviar mensaje
        </button>
      </form>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '0.75rem',
  background: '#282828',
  border: '1px solid #404040',
  borderRadius: '4px',
  color: 'white',
  fontSize: '1rem',
  outline: 'none',
  transition: 'border-color 0.2s'
};

export default Contact;