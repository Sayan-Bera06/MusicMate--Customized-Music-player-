// IndexedDB helper for songs and playlists
const DB_NAME = 'music_app_db';
const DB_VERSION = 1;
const SONGS_STORE = 'songs';
const PLAYLISTS_STORE = 'playlists';

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(SONGS_STORE)) {
        db.createObjectStore(SONGS_STORE, { keyPath: 'id', autoIncrement: true });
      }
      if (!db.objectStoreNames.contains(PLAYLISTS_STORE)) {
        db.createObjectStore(PLAYLISTS_STORE, { keyPath: 'id', autoIncrement: true });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

const dbUtils = {
  async addSong(song) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(SONGS_STORE, 'readwrite');
      const store = tx.objectStore(SONGS_STORE);
      const req = store.add(song);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  },
  async getSongs() {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(SONGS_STORE, 'readonly');
      const store = tx.objectStore(SONGS_STORE);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  },
  async deleteSong(id) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(SONGS_STORE, 'readwrite');
      const store = tx.objectStore(SONGS_STORE);
      const req = store.delete(id);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  },
  async addPlaylist(playlist) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(PLAYLISTS_STORE, 'readwrite');
      const store = tx.objectStore(PLAYLISTS_STORE);
      const req = store.add(playlist);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  },
  async getPlaylists() {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(PLAYLISTS_STORE, 'readonly');
      const store = tx.objectStore(PLAYLISTS_STORE);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  },
  async updatePlaylist(playlist) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(PLAYLISTS_STORE, 'readwrite');
      const store = tx.objectStore(PLAYLISTS_STORE);
      const req = store.put(playlist);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  },
  async deletePlaylist(id) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(PLAYLISTS_STORE, 'readwrite');
      const store = tx.objectStore(PLAYLISTS_STORE);
      const req = store.delete(id);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  },
};