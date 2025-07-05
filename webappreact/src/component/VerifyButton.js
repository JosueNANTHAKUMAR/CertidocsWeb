import React, { useState } from 'react';
import { FaShieldAlt, FaSpinner, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import './VerifyButton.css';

const VerifyButton = ({ 
  onClick, 
  disabled = false, 
  isVerifying = false, 
  verificationResult = null,
  children = "Vérifier la signature"
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [ripple, setRipple] = useState(null);

  const handleMouseDown = (e) => {
    if (disabled || isVerifying) return;
    
    setIsPressed(true);
    
    // Effet ripple
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setRipple({ x, y });
    
    setTimeout(() => setRipple(null), 600);
  };

  const handleMouseUp = () => {
    setIsPressed(false);
  };

  const handleMouseEnter = () => {
    if (!disabled && !isVerifying) {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setIsPressed(false);
  };

  const getButtonContent = () => {
    if (isVerifying) {
      return (
        <>
          <FaSpinner className="button-icon spinning" />
          <span>Vérification en cours...</span>
        </>
      );
    }
    
    if (verificationResult === 'success') {
      return (
        <>
          <FaCheckCircle className="button-icon success" />
          <span>Signature Validée</span>
        </>
      );
    }
    
    if (verificationResult === 'error') {
      return (
        <>
          <FaTimesCircle className="button-icon error" />
          <span>Signature Invalide</span>
        </>
      );
    }
    
    return (
      <>
        <FaShieldAlt className="button-icon" />
        <span>{children}</span>
      </>
    );
  };

  const getButtonClass = () => {
    let className = 'verify-button';
    
    if (disabled) className += ' disabled';
    if (isVerifying) className += ' verifying';
    if (verificationResult === 'success') className += ' success';
    if (verificationResult === 'error') className += ' error';
    if (isHovered) className += ' hovered';
    if (isPressed) className += ' pressed';
    
    return className;
  };

  return (
    <button
      className={getButtonClass()}
      onClick={onClick}
      disabled={disabled || isVerifying}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleMouseDown}
      onTouchEnd={handleMouseUp}
    >
      <div className="button-content">
        {getButtonContent()}
      </div>
      
      {ripple && (
        <div 
          className="ripple-effect"
          style={{
            left: ripple.x,
            top: ripple.y
          }}
        />
      )}
      
      <div className="button-glow"></div>
      <div className="button-shine"></div>
    </button>
  );
};

export default VerifyButton; 