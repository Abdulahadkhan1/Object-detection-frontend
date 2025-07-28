import React, { useRef, useState } from 'react';

const App = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef();
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleCapture = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setUploadSuccess(false);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!image) return;
    setUploading(true);
    setError(null);
    setUploadSuccess(false);
    const formData = new FormData();
    formData.append('image', image);
    try {
      const response = await fetch('http://localhost:3000/upload', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) throw new Error('Upload failed');
      setUploadSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '2rem auto', textAlign: 'center', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ color: '#333' }}>Capture or Upload Image</h2>
      <input
        type="file"
        accept="image/*"
        capture="environment"
        style={{ display: 'none' }}
        ref={fileInputRef}
        onChange={handleCapture}
      />
      <div style={{ marginBottom: '1rem' }}>
        <button
          onClick={() => fileInputRef.current.setAttribute('capture', 'environment') || fileInputRef.current.click()}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007BFF',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px',
            marginRight: '10px',
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = '#0056b3')}
          onMouseOut={(e) => (e.target.style.backgroundColor = '#007BFF')}
        >
          Capture Image
        </button>
        <button
          onClick={() => fileInputRef.current.removeAttribute('capture') || fileInputRef.current.click()}
          style={{
            padding: '10px 20px',
            backgroundColor: '#28a745',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px',
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = '#218838')}
          onMouseOut={(e) => (e.target.style.backgroundColor = '#28a745')}
        >
          Upload from Gallery
        </button>
      </div>
      {preview && (
        <div style={{ margin: '1rem 0' }}>
          <img src={preview} alt="Preview" style={{ maxWidth: '100%', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' }} />
        </div>
      )}
      {image && (
        <button
          onClick={handleUpload}
          disabled={uploading}
          style={{
            padding: '10px 20px',
            backgroundColor: uploading ? '#6c757d' : '#28a745',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: uploading ? 'not-allowed' : 'pointer',
            fontSize: '16px',
          }}
          onMouseOver={(e) => !uploading && (e.target.style.backgroundColor = '#218838')}
          onMouseOut={(e) => !uploading && (e.target.style.backgroundColor = '#28a745')}
        >
          {uploading ? 'Uploading...' : 'Upload Image'}
        </button>
      )}
      {uploadSuccess && <div style={{ color: 'green', marginTop: 10, fontWeight: 'bold' }}>Upload successful!</div>}
      {error && <div style={{ color: 'red', marginTop: 10, fontWeight: 'bold' }}>{error}</div>}
    </div>
  );
};

export default App;