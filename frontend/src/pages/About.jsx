import { Music, Code, Heart } from 'lucide-react';

function About() {
  return (
    <div style={{
      maxWidth: '800px',
      margin: '0 auto',
      padding: '3rem 2rem'
    }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
        Acerca de Fermusic
      </h1>
      
      <p style={{ 
        color: '#b3b3b3', 
        fontSize: '1.1rem', 
        lineHeight: '1.6',
        marginBottom: '2rem' 
      }}>
        Este es un proyecto educativo creado con React y Node.js para aprender
        sobre desarrollo web full-stack y crear una experiencia de reproductor
        de música similar a Spotify.
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '2rem',
        marginTop: '3rem'
      }}>
        <FeatureCard
          icon={<Music size={40} />}
          title="Reproductor de Audio"
          description="Reproduce tu música favorita con controles intuitivos"
        />
        
        <FeatureCard
          icon={<Code size={40} />}
          title="React + Node.js"
          description="Construido con tecnologías modernas de desarrollo web"
        />
        
        <FeatureCard
          icon={<Heart size={40} />}
          title="Proyecto Educativo"
          description="Hecho con amor para aprender programación"
        />
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div style={{
      background: '#181818',
      padding: '2rem',
      borderRadius: '8px',
      textAlign: 'center'
    }}>
      <div style={{ 
        color: '#1DB954', 
        marginBottom: '1rem',
        display: 'flex',
        justifyContent: 'center'
      }}>
        {icon}
      </div>
      <h3 style={{ marginBottom: '0.5rem', fontSize: '1.2rem' }}>
        {title}
      </h3>
      <p style={{ color: '#b3b3b3', fontSize: '0.9rem' }}>
        {description}
      </p>
    </div>
  );
}

export default About;