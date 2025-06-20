import React from 'react';
import CustomTextInput from './CustomTextInput';

const TexteSection = ({ value, onChange }) => (
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

export default TexteSection; 