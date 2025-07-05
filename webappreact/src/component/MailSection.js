import React, { useState, useEffect, useRef } from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import './MailSection.css';

const MailSection = ({ message, isConnected, active }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const sectionRef = useRef(null);

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
  
  useEffect(() => {
    if (active && sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [active]);

  if (!isConnected) {
    return <div style={{ color: 'var(--text-muted)', textAlign: 'center', margin: '1.5em 0' }}>Connectez votre wallet pour pouvoir signer un message</div>;
  }
  if (!message) {
    return null;
  }

  return (
    <div ref={sectionRef} className={`mail-section-loading ${isDone ? 'completed' : ''}`}>
      {isLoading && (
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          padding: '32px 20px',
          textAlign: 'center'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            border: '3px solid #f3f3f3',
            borderTop: '3px solid #9584ff',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          <div style={{ 
            fontSize: '18px', 
            fontWeight: '600', 
            color: '#333', 
            marginBottom: '12px' 
          }}>
            Récupération en cours...
          </div>
          <div style={{ 
            fontSize: '14px', 
            color: '#666',
            lineHeight: '1.4'
          }}>
            Analyse du contenu mail
          </div>
        </div>
      )}

      {isDone && (
        <div style={{ 
          textAlign: 'center', 
          padding: '32px 20px' 
        }}>
          <FaCheckCircle style={{ 
            fontSize: '48px', 
            marginBottom: '16px',
            color: '#4CAF50'
          }} />
          <div style={{ 
            fontSize: '20px', 
            fontWeight: '600', 
            color: '#333', 
            marginBottom: '12px' 
          }}>
            Contenu récupéré !
          </div>
          <div style={{ 
            color: '#666', 
            fontSize: '14px',
            lineHeight: '1.4' 
          }}>
            Votre message est prêt à être signé
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