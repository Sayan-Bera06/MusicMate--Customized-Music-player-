function SongUpload({ onUpload }) {
  const [uploading, setUploading] = React.useState(false);
  const [thumbnail, setThumbnail] = React.useState(null);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const title = file.name.replace(/\.[^/.]+$/, "");
    const song = { title, file };

    // Read file as Blob
    const arrayBuffer = await file.arrayBuffer();
    song.file = new Blob([arrayBuffer], { type: file.type });

    // Add thumbnail if present
    if (thumbnail) {
      const thumbArrayBuffer = await thumbnail.arrayBuffer();
      song.thumbnail = new Blob([thumbArrayBuffer], { type: thumbnail.type });
      song.thumbnailName = thumbnail.name;
    }

    await onUpload(song);
    setUploading(false);
    e.target.value = '';
    setThumbnail(null);
  };

  return (
    <div>
      <input type="file" accept="audio/*" onChange={handleUpload} disabled={uploading} />
      <br />
      <label>
        Thumbnail:
        <input
          type="file"
          accept="image/*"
          onChange={e => setThumbnail(e.target.files[0])}
          disabled={uploading}
        />
      </label>
      {thumbnail && (
        <div style={{ marginTop: 8 }}>
          <img
            src={URL.createObjectURL(thumbnail)}
            alt="Thumbnail preview"
            style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 8 }}
            onLoad={e => URL.revokeObjectURL(e.target.src)}
          />
        </div>
      )}
    </div>
  );
}