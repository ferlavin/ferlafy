import { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Repeat, Shuffle } from 'lucide-react';

function Player({ song, isPlaying, setIsPlaying, onNext, onPrevious, hasNext, hasPrevious, shuffle, setShuffle, repeat, setRepeat }) {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, song]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    setDuration(audioRef.current.duration);
  };

  const handleSeek = (e) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    audioRef.current.currentTime = time;
  };

  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      background: '#181818',
      borderTop: '1px solid #282828',
      padding: '1rem 2rem',
      zIndex: 1000
    }}>
      <audio
        ref={audioRef}
        src={song.file}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => {
          if (repeat) {
            audioRef.current.currentTime = 0;
            audioRef.current.play();
          } else if (hasNext) {
            setIsPlaying(false);
            onNext();
          } else {
            setIsPlaying(false);
          }
        }}
      />

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        marginBottom: '0.5rem'
      }}>
        <img 
          src={song.cover} 
          alt={song.title}
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '4px'
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

        <div style={{
          display: 'flex',
          gap: '0.5rem',
          alignItems: 'center'
        }}>
          {/* Botón Shuffle */}
          <button 
            onClick={() => setShuffle(!shuffle)}
            style={{
              ...controlButton,
              color: shuffle ? '#1DB954' : 'white',
              opacity: shuffle ? 1 : 0.7
            }}
            title="Aleatorio"
          >
            <Shuffle size={18} />
          </button>

          {/* Botón Anterior */}
          <button 
            onClick={onPrevious}
            disabled={!hasPrevious}
            style={{
              ...controlButton,
              opacity: hasPrevious ? 1 : 0.3,
              cursor: hasPrevious ? 'pointer' : 'not-allowed'
            }}
          >
            <SkipBack size={20} />
          </button>
          
          {/* Botón Play/Pause */}
          <button 
            onClick={togglePlay}
            style={{
              ...controlButton,
              background: '#1DB954',
              width: '40px',
              height: '40px'
            }}
          >
            {isPlaying ? <Pause size={24} /> : <Play size={24} />}
          </button>
          
          {/* Botón Siguiente */}
          <button 
            onClick={onNext}
            disabled={!hasNext}
            style={{
              ...controlButton,
              opacity: hasNext ? 1 : 0.3,
              cursor: hasNext ? 'pointer' : 'not-allowed'
            }}
          >
            <SkipForward size={20} />
          </button>

          {/* Botón Repeat */}
          <button 
            onClick={() => setRepeat(!repeat)}
            style={{
              ...controlButton,
              color: repeat ? '#1DB954' : 'white',
              opacity: repeat ? 1 : 0.7
            }}
            title="Repetir"
          >
            <Repeat size={18} />
          </button>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          width: '150px'
        }}>
          <Volume2 size={20} />
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            style={sliderStyle}
          />
        </div>
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem'
      }}>
        <span style={{ fontSize: '0.75rem', color: '#b3b3b3', minWidth: '40px' }}>
          {formatTime(currentTime)}
        </span>
        
        <input
          type="range"
          min="0"
          max={duration || 0}
          value={currentTime}
          onChange={handleSeek}
          style={{ ...sliderStyle, flex: 1 }}
        />
        
        <span style={{ fontSize: '0.75rem', color: '#b3b3b3', minWidth: '40px' }}>
          {formatTime(duration)}
        </span>
      </div>
    </div>
  );
}

const controlButton = {
  background: 'transparent',
  border: 'none',
  color: 'white',
  cursor: 'pointer',
  padding: '0.5rem',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.2s'
};

const sliderStyle = {
  width: '100%',
  cursor: 'pointer',
  accentColor: '#1DB954'
};

export default Player;