import SongItem from './SongItem';

function SongList({ songs, onSongClick, currentSong, onDelete }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
      gap: '1.5rem',
      padding: '2rem'
    }}>
      {songs.map(song => (
        <SongItem 
          key={song.id} 
          song={song} 
          onClick={onSongClick}
          isActive={currentSong?.id === song.id}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

export default SongList;