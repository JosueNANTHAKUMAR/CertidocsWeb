import React, { useState, useEffect } from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import './MailSection.css';

const MailSection = ({ message, isConnected, active }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    if (!isConnected || !active) return;
    if (message) {
      setIsLoading(true);
      setIsDone(false);

      // Animation simple de 2 secondes
      const timer = setTimeout(() => {
        setIsLoading(false);
        setIsDone(true);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [message, isConnected, active]);

  if (!isConnected) {
    return <div style={{ color: 'var(--text-muted)', textAlign: 'center', margin: '1.5em 0' }}>Connectez votre wallet pour pouvoir signer un message</div>;
  }
  if (!message) {
    return null;
  }

  return (
    <div className={`mail-section-loading ${isDone ? 'completed' : ''}`}>
      {isLoading && (
        <div style={{ 
          display: 'flex', 
          flexDirection: 'row', 
          alignItems: 'center', 
          justifyContent: 'center',
          padding: '6px 8px',
          textAlign: 'left'
        }}>
          <div style={{
            width: '18px',
            height: '18px',
            border: '2px solid #f3f3f3',
            borderTop: '2px solid #9584ff',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            marginRight: '8px',
            flexShrink: 0
          }}></div>
          <div>
            <div style={{ 
              fontSize: '15px', 
              fontWeight: '600', 
              color: '#333', 
              marginBottom: '2px' 
            }}>
              Récupération en cours...
            </div>
            <div style={{ 
              fontSize: '12px', 
              color: '#666',
              lineHeight: '1.2'
            }}>
              Analyse du contenu mail
            </div>
          </div>
        </div>
      )}

      {isDone && (
        <div style={{ 
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '6px 8px'
        }}>
          <FaCheckCircle style={{ 
            fontSize: '18px', 
            marginRight: '8px',
            color: '#4CAF50',
            flexShrink: 0
          }} />
          <div>
            <div style={{ 
              fontSize: '15px', 
              fontWeight: '600', 
              color: '#333', 
              marginBottom: '2px' 
            }}>
              Contenu récupéré !
            </div>
            <div style={{ 
              color: '#666', 
              fontSize: '12px',
              lineHeight: '1.2' 
            }}>
              Votre message est prêt à être signé
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default MailSection;