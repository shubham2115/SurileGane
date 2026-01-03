import React, { useRef, useEffect, useState } from 'react';
import axios from 'axios';

function MusicPlayer({ song }) {
  const audioRef = useRef(null);
  const [audioUrl, setAudioUrl] = useState(null);

  useEffect(() => {
    if (song) {
      fetchAudioBlob();
    }
  }, [song]);

  const fetchAudioBlob = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `http://localhost:5000/api/songs/${song.id}/stream`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'blob'
        }
      );
      
      const url = URL.createObjectURL(response.data);
      setAudioUrl(url);
      
      // Play after loading
      if (audioRef.current) {
        audioRef.current.load();
        audioRef.current.play().catch(err => console.log('Autoplay prevented:', err));
      }
    } catch (error) {
      console.error('Error loading audio:', error);
    }
  };

  useEffect(() => {
    // Cleanup blob URL when component unmounts or song changes
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  if (!song || !audioUrl) return null;

  return (
    <div className="music-player">
      <div className="player-content">
        <div className="player-info">
          <div className="player-title">{song.title}</div>
          <div className="player-artist">{song.artist}</div>
        </div>
        <div className="player-controls">
          <audio
            ref={audioRef}
            controls
            preload="metadata"
            src={audioUrl}
          >
            Your browser does not support the audio element.
          </audio>
        </div>
      </div>
    </div>
  );
}

export default MusicPlayer;
