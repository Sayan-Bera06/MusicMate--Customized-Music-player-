function SongList({ songs, onPlay, onDelete, onAddToPlaylist, playlists }) {
  const [selectedPlaylist, setSelectedPlaylist] = React.useState('');

  return (
    <div>
      <ul>
        {songs.map((song) => (
          <li key={song.id}>
            {song.thumbnail && (
              <img
                src={URL.createObjectURL(song.thumbnail)}
                alt="thumb"
                style={{ width: 32, height: 32, objectFit: 'cover', borderRadius: 4, marginRight: 8 }}
                onLoad={e => URL.revokeObjectURL(e.target.src)}
              />
            )}
            <span>{song.title}</span>
            <span>
              <button onClick={() => onPlay(song)}>Play</button>
              <button onClick={() => onDelete(song.id)}>Delete</button>
              {playlists.length > 0 && (
                <React.Fragment>
                  <select
                    value={selectedPlaylist}
                    onChange={e => setSelectedPlaylist(e.target.value)}
                  >
                    <option value="">Add to playlist...</option>
                    {playlists.map(pl => (
                      <option key={pl.id} value={pl.id}>{pl.name}</option>
                    ))}
                  </select>
                  <button
                    disabled={!selectedPlaylist}
                    onClick={() => {
                      if (selectedPlaylist) onAddToPlaylist(song.id, selectedPlaylist);
                    }}
                  >
                    Add
                  </button>
                </React.Fragment>
              )}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
