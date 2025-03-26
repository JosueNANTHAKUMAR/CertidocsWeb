import React from 'react';

const ButtonCustom = (
  { id,
    className,
    children,
    disabled = false, 
  }) => {

    return (
      <button id={id} className={className} disabled={disabled}>
        {children}
      </button>
    );
  };
  
export default ButtonCustom;