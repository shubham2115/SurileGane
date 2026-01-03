import React, { useState } from 'react';
import { songsAPI } from '../services/api';

function UploadSong({ onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    album: '',
    duration: '',
  });
  const [songFile, setSongFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSongFileChange = (e) => {
    setSongFile(e.target.files[0]);
  };

  const handleCoverFileChange = (e) => {
    setCoverFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!songFile) {
      setError('Please select a song file');
      return;
    }

    setUploading(true);
    setError('');

    try {
      // Upload song
      const songFormData = new FormData();
      songFormData.append('song', songFile);
      songFormData.append('title', formData.title);
      songFormData.append('artist', formData.artist);
      songFormData.append('album', formData.album);
      songFormData.append('duration', formData.duration);

      const response = await songsAPI.upload(songFormData);

      // Upload cover if provided
      if (coverFile) {
        const coverFormData = new FormData();
        coverFormData.append('cover', coverFile);
        await songsAPI.uploadCover(response.data.song.id, coverFormData);
      }

      onSuccess();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to upload song');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="upload-form">
      <h2>Upload New Song</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Song Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Artist *</label>
          <input
            type="text"
            name="artist"
            value={formData.artist}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Album</label>
          <input
            type="text"
            name="album"
            value={formData.album}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Duration (seconds)</label>
          <input
            type="number"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Song File * (MP3, WAV, OGG, M4A, FLAC)</label>
          <div className="file-input">
            <input
              type="file"
              id="song-file"
              accept="audio/*"
              onChange={handleSongFileChange}
              required
            />
            <label htmlFor="song-file">
              {songFile ? songFile.name : 'Click to select song file'}
            </label>
          </div>
        </div>
        <div className="form-group">
          <label>Cover Image (Optional)</label>
          <div className="file-input">
            <input
              type="file"
              id="cover-file"
              accept="image/*"
              onChange={handleCoverFileChange}
            />
            <label htmlFor="cover-file">
              {coverFile ? coverFile.name : 'Click to select cover image'}
            </label>
          </div>
        </div>
        <button type="submit" className="btn" disabled={uploading}>
          {uploading ? 'Uploading...' : 'Upload Song'}
        </button>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
      </form>
    </div>
  );
}

export default UploadSong;
