function AudioPlayer({ song, onEnded }) {
  const [audioUrl, setAudioUrl] = React.useState(null);
  const [thumbUrl, setThumbUrl] = React.useState(null);

  React.useEffect(() => {
    if (song) {
      const url = URL.createObjectURL(song.file);
      setAudioUrl(url);
      if (song.thumbnail) {
        const thumb = URL.createObjectURL(song.thumbnail);
        setThumbUrl(thumb);
        return () => {
          URL.revokeObjectURL(url);
          URL.revokeObjectURL(thumb);
        };
      } else {
        setThumbUrl(null);
        return () => {
          URL.revokeObjectURL(url);
        };
      }
    } else {
      setAudioUrl(null);
      setThumbUrl(null);
    }
  }, [song]);

  if (!song) return null;

  return (
    <div className="audio-player">
      {thumbUrl && (
        <img
          src={thumbUrl}
          alt="Song thumbnail"
          style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8 }}
        />
      )}
      <span className="song-title">{song.title}</span>
      <audio src={audioUrl} controls autoPlay onEnded={onEnded} />
    </div>
  );
}