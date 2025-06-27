import React from 'react';
import CustomTextInput from './CustomTextInput';

const TexteSection = ({ value, onChange }) => {
  // Si une valeur (venant du mail) est déjà présente, on n'affiche pas ce composant.
  if (value) {
    return null;
  }

  return (
    <div style={{ margin: '16px 0' }}>
      <CustomTextInput
        id="texteSectionInput"
        rows={6}
        placeholder="Saisissez votre texte ici..."
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default TexteSection; 