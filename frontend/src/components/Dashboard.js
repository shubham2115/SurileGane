import React, { useState, useEffect } from 'react';
import { songsAPI } from '../services/api';
import UploadSong from './UploadSong';
import MusicPlayer from './MusicPlayer';

function Dashboard({ user, onLogout }) {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showUpload, setShowUpload] = useState(false);
  const [currentSong, setCurrentSong] = useState(null);

  useEffect(() => {
    fetchSongs();
  }, []);

  const fetchSongs = async () => {
    try {
      const response = await songsAPI.getAll();
      setSongs(response.data);
    } catch (err) {
      setError('Failed to fetch songs');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this song?')) {
      return;
    }

    try {
      await songsAPI.delete(id);
      setSongs(songs.filter(song => song.id !== id));
      if (currentSong?.id === id) {
        setCurrentSong(null);
      }
    } catch (err) {
      alert('Failed to delete song');
    }
  };

  const handlePlay = (song) => {
    setCurrentSong(song);
  };

  const handleUploadSuccess = () => {
    setShowUpload(false);
    fetchSongs();
  };

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  return (
    <div className="container">
      <div className="header">
        <h1>🎵 Songs App</h1>
        <div className="header-info">
          <div className="user-info">
            Welcome, <strong>{user.username}</strong>
            <span className="user-role">{user.role}</span>
          </div>
          <button className="btn-logout" onClick={onLogout}>
            Logout
          </button>
        </div>
      </div>

      {error && <div className="error">{error}</div>}

      {showUpload ? (
        <UploadSong 
          onSuccess={handleUploadSuccess} 
          onCancel={() => setShowUpload(false)} 
        />
      ) : (
        <div className="songs-container">
          <div className="songs-header">
            <h2>All Songs</h2>
            {user.role === 'admin' && (
              <button className="btn-upload" onClick={() => setShowUpload(true)}>
                + Upload Song
              </button>
            )}
          </div>

          {songs.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🎵</div>
              <p>No songs available yet</p>
              {user.role === 'admin' && <p>Upload your first song!</p>}
            </div>
          ) : (
            <div className="songs-list">
              {songs.map((song) => (
                <div key={song.id} className="song-card">
                  <div className="song-cover">
                    {song.cover_image ? (
                      <img 
                        src={`http://localhost:5000${song.cover_image}`} 
                        alt={song.title} 
                      />
                    ) : (
                      '🎵'
                    )}
                  </div>
                  <div className="song-info">
                    <div className="song-title">{song.title}</div>
                    <div className="song-artist">{song.artist}</div>
                    {song.album && <div className="song-artist">Album: {song.album}</div>}
                  </div>
                  <div className="song-actions">
                    <button className="btn-play" onClick={() => handlePlay(song)}>
                      ▶ Play
                    </button>
                    {user.role === 'admin' && (
                      <button className="btn-delete" onClick={() => handleDelete(song.id)}>
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {currentSong && <MusicPlayer song={currentSong} />}
    </div>
  );
}

export default Dashboard;
