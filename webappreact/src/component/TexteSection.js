import React from 'react';
import CustomTextInput from './CustomTextInput';

const TexteSection = ({ value, onChange }) => {
  // Si une valeur (venant du mail) est déjà présente, on n'affiche pas ce composant.
  if (value) {
    return null;
  }

  return (<div className="texte-section">
    </div>);
};

export default TexteSection; 