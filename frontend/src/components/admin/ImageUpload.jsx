import { useState } from 'react';
import api from '../../services/api.js';

function ImageUpload({ value, onChange, label }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError('');

    try {
      const response = await api.uploadFile(file);
      onChange(response.data.url);
    } catch (err) {
      setError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <label className="image-upload">
      {label || 'Image'}
      {value && (
        <div className="image-upload__preview">
          <img src={value} alt="Preview" />
        </div>
      )}
      <input
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        onChange={handleFileChange}
        disabled={uploading}
        style={{ display: 'none' }}
      />
      <span className="image-upload__btn" role="button" tabIndex={0}>
        {uploading ? 'Uploading...' : value ? 'Change Image' : 'Choose Image'}
      </span>
      {error && <small className="image-upload__error">{error}</small>}
    </label>
  );
}

export default ImageUpload;
