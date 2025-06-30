function PlaylistManager({ playlists, songs, onCreate, onDelete, onRename, onRemoveSong, onPlaySong }) {
    const [newName, setNewName] = React.useState('');
    const [editingId, setEditingId] = React.useState(null);
    const [editingName, setEditingName] = React.useState('');
  
    return (
      <div>
        <h3>Create Playlist</h3>
        <input
          type="text"
          placeholder="Playlist name"
          value={newName}
          onChange={e => setNewName(e.target.value)}
        />
        <button
          onClick={() => {
            if (newName.trim()) {
              onCreate(newName.trim());
              setNewName('');
            }
          }}
        >Create</button>
        <ul>
          {playlists.map(pl => (
            <li key={pl.id}>
              {editingId === pl.id ? (
                <React.Fragment>
                  <input
                    value={editingName}
                    onChange={e => setEditingName(e.target.value)}
                  />
                  <button onClick={() => {
                    onRename(pl.id, editingName);
                    setEditingId(null);
                  }}>Save</button>
                  <button onClick={() => setEditingId(null)}>Cancel</button>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <span className="playlist-title">{pl.name}</span>
                  <button onClick={() => { setEditingId(pl.id); setEditingName(pl.name); }}>Rename</button>
                  <button onClick={() => onDelete(pl.id)}>Delete</button>
                </React.Fragment>
              )}
              {pl.songIds.length > 0 && (
                <div className="playlist-songs">
                  <strong>Songs:</strong>
                  <ul>
                    {pl.songIds.map(sid => {
                      const song = songs.find(s => s.id === sid);
                      if (!song) return null;
                      return (
                        <li key={sid}>
                          <span>{song.title}</span>
                          <button onClick={() => onPlaySong(song)}>Play</button>
                          <button onClick={() => onRemoveSong(pl.id, sid)}>Remove</button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    );
  }