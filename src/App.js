// Make sure dbUtils is available globally (from db.js)

function App() {
    const [songs, setSongs] = React.useState([]);
    const [playlists, setPlaylists] = React.useState([]);
    const [currentSong, setCurrentSong] = React.useState(null);
  
    // Load songs and playlists from IndexedDB
    React.useEffect(() => {
      dbUtils.getSongs().then(setSongs);
      dbUtils.getPlaylists().then(setPlaylists);
    }, []);
  
    // Song upload handler
    const handleUpload = async (song) => {
      await dbUtils.addSong(song);
      setSongs(await dbUtils.getSongs());
    };
  
    // Song delete handler
    const handleDeleteSong = async (id) => {
      await dbUtils.deleteSong(id);
      // Remove song from all playlists
      const updatedPlaylists = playlists.map(pl => ({
        ...pl,
        songIds: pl.songIds.filter(sid => sid !== id)
      }));
      for (const pl of updatedPlaylists) {
        await dbUtils.updatePlaylist(pl);
      }
      setPlaylists(await dbUtils.getPlaylists());
      setSongs(await dbUtils.getSongs());
      if (currentSong && currentSong.id === id) setCurrentSong(null);
    };
  
    // Add song to playlist
    const handleAddToPlaylist = async (songId, playlistId) => {
      const pl = playlists.find(p => p.id == playlistId);
      if (!pl || pl.songIds.includes(songId)) return;
      const updated = { ...pl, songIds: [...pl.songIds, songId] };
      await dbUtils.updatePlaylist(updated);
      setPlaylists(await dbUtils.getPlaylists());
    };
  
    // Playlist create
    const handleCreatePlaylist = async (name) => {
      await dbUtils.addPlaylist({ name, songIds: [] });
      setPlaylists(await dbUtils.getPlaylists());
    };
  
    // Playlist delete
    const handleDeletePlaylist = async (id) => {
      await dbUtils.deletePlaylist(id);
      setPlaylists(await dbUtils.getPlaylists());
    };
  
    // Playlist rename
    const handleRenamePlaylist = async (id, newName) => {
      const pl = playlists.find(p => p.id === id);
      if (!pl) return;
      const updated = { ...pl, name: newName };
      await dbUtils.updatePlaylist(updated);
      setPlaylists(await dbUtils.getPlaylists());
    };
  
    // Remove song from playlist
    const handleRemoveSongFromPlaylist = async (playlistId, songId) => {
      const pl = playlists.find(p => p.id === playlistId);
      if (!pl) return;
      const updated = { ...pl, songIds: pl.songIds.filter(sid => sid !== songId) };
      await dbUtils.updatePlaylist(updated);
      setPlaylists(await dbUtils.getPlaylists());
    };
  
    // Play song
    const handlePlaySong = (song) => setCurrentSong(song);
  
    // Play next song (if in playlist)
    const handleSongEnded = () => {
      if (!currentSong) return;
      // Find if song is in a playlist
      for (const pl of playlists) {
        const idx = pl.songIds.indexOf(currentSong.id);
        if (idx !== -1 && idx < pl.songIds.length - 1) {
          const nextSongId = pl.songIds[idx + 1];
          const nextSong = songs.find(s => s.id === nextSongId);
          if (nextSong) {
            setCurrentSong(nextSong);
            return;
          }
        }
      }
      setCurrentSong(null);
    };
  
    return (
      <div className="container">
        <h1>🎵 Music Web App</h1>
        <div className="flex">
          <div className="section">
            <h2>Upload Song</h2>
            <SongUpload onUpload={handleUpload} />
          </div>
          <div className="section">
            <h2>All Songs</h2>
            <SongList
              songs={songs}
              onPlay={handlePlaySong}
              onDelete={handleDeleteSong}
              onAddToPlaylist={handleAddToPlaylist}
              playlists={playlists}
            />
          </div>
        </div>
        <div className="section">
          <h2>Playlists</h2>
          <PlaylistManager
            playlists={playlists}
            songs={songs}
            onCreate={handleCreatePlaylist}
            onDelete={handleDeletePlaylist}
            onRename={handleRenamePlaylist}
            onRemoveSong={handleRemoveSongFromPlaylist}
            onPlaySong={handlePlaySong}
          />
        </div>
        <AudioPlayer song={currentSong} onEnded={handleSongEnded} />
      </div>
    );
  }
  
  ReactDOM.createRoot(document.getElementById('root')).render(<App />);