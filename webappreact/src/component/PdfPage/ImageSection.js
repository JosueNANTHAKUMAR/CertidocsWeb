import React, { useRef, useState } from 'react';
import { FaImage, FaTrashAlt, FaUpload } from 'react-icons/fa';
import './ImageSection.css';

export default function ImageSection({ value, onChange }) {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.match(/^image\/(png|jpe?g)$/)) {
      setFile(file);
      setPreview(URL.createObjectURL(file));
      onChange && onChange(file);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.match(/^image\/(png|jpe?g)$/)) {
      setFile(file);
      setPreview(URL.createObjectURL(file));
      onChange && onChange(file);
    }
  };

  const handleRemove = () => {
    setFile(null);
    setPreview("");
    onChange && onChange(null);
    inputRef.current.value = null;
  };

  return (
    <div
      className={`pdf-dropzone-2025${dragActive ? ' active' : ''}`}
      onDragOver={e => { e.preventDefault(); setDragActive(true); }}
      onDragLeave={e => { e.preventDefault(); setDragActive(false); }}
      onDrop={handleDrop}
      onClick={() => inputRef.current.click()}
      tabIndex={0}
      style={{ cursor: 'pointer' }}
    >
      <input
        type="file"
        accept="image/png,image/jpeg,image/jpg"
        style={{ display: 'none' }}
        ref={inputRef}
        onChange={handleFileChange}
      />
      {!file ? (
        <div className="pdf-drop-content-2025">
          <FaUpload style={{ fontSize: 32, color: 'var(--accent)', marginBottom: 8 }} />
          <div style={{ color: 'var(--accent)', fontWeight: 600, fontSize: '1.08em' }}>Déposez une image ici</div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.98em', marginTop: 2 }}>ou cliquez pour sélectionner un fichier PNG/JPG</div>
        </div>
      ) : (
        <div className="pdf-file-info-2025">
          <FaImage style={{ fontSize: 28, color: '#9584ff', marginRight: 8 }} />
          <span className="pdf-file-name-2025">{file.name}</span>
          <img src={preview} alt="aperçu" style={{ maxHeight: 48, maxWidth: 48, borderRadius: 8, marginLeft: 8, boxShadow: '0 2px 8px #9584ff22' }} />
          <button className="pdf-remove-btn-2025" onClick={e => { e.stopPropagation(); handleRemove(); }} title="Supprimer l'image">
            <FaTrashAlt />
          </button>
        </div>
      )}
    </div>
  );
} 