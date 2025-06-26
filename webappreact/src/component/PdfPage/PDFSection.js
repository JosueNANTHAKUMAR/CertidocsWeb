import React, { useRef, useState } from 'react';
import { FaFilePdf, FaTrashAlt, FaUpload } from 'react-icons/fa';
import './PDFSection.css';

export default function PDFSection({ value, onChange }) {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef();
  const [fileName, setFileName] = useState("");

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/pdf') {
      setFileName(file.name);
      onChange && onChange(file);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setFileName(file.name);
      onChange && onChange(file);
    }
  };

  const handleRemove = () => {
    setFileName("");
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
        accept="application/pdf"
        style={{ display: 'none' }}
        ref={inputRef}
        onChange={handleFileChange}
      />
      {!fileName ? (
        <div className="pdf-drop-content-2025">
          <FaUpload style={{ fontSize: 32, color: 'var(--accent)', marginBottom: 8 }} />
          <div style={{ color: 'var(--accent)', fontWeight: 600, fontSize: '1.08em' }}>Déposez un PDF ici</div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.98em', marginTop: 2 }}>ou cliquez pour sélectionner un fichier</div>
        </div>
      ) : (
        <div className="pdf-file-info-2025">
          <FaFilePdf style={{ fontSize: 28, color: '#9584ff', marginRight: 8 }} />
          <span className="pdf-file-name-2025">{fileName}</span>
          <button className="pdf-remove-btn-2025" onClick={e => { e.stopPropagation(); handleRemove(); }} title="Supprimer le PDF">
            <FaTrashAlt />
          </button>
        </div>
      )}
    </div>
  );
} 