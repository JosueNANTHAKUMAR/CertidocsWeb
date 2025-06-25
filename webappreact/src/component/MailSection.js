import React, { useState, useEffect } from 'react';
import './MailSection.css';
import LoaderSignature from './LoaderSignature';

const CHECKLIST_ITEMS = [
  "Récupération du message...",
  "Analyse des données...",
  "Préparation de la signature...",
  "Prêt !",
];

// --- Icônes SVG pour chaque état ---

const HourglassIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 4h12v2H6V4zm2 14h8v2H8v-2zm-2-9h12v6H6v-6zm2-2h8v2H8V7z" fill="#6c757d" opacity="0.7"/>
    <path d="M7 9v4h10V9H7z" fill="#6c757d"/>
  </svg>
);

const SpinnerIcon = () => (
  <svg className="spinner-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2.5a9.5 9.5 0 1 0 0 19 9.5 9.5 0 0 0 0-19z" stroke="#6c757d" strokeWidth="2" strokeDasharray="4 4" />
  </svg>
);

const CheckmarkIcon = () => (
  <svg className="checkmark-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 13l4 4L19 7" stroke="#4CAF50" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const getIconForStatus = (status) => {
  switch (status) {
    case 'processing': return <SpinnerIcon />;
    case 'completed': return <CheckmarkIcon />;
    case 'waiting':
    default: return <HourglassIcon />;
  }
};


const MailSection = ({ message }) => {
  const [items, setItems] = useState([]);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    if (message) {
      // Initialise tous les items en 'waiting'
      const initialItems = CHECKLIST_ITEMS.map((label) => ({ label, status: 'waiting' }));
      setItems(initialItems);
      setIsDone(false);

      const timeouts = [];
      let delay = 500; // Délai initial

      initialItems.forEach((_, index) => {
        // Lance le traitement
        let timeout1 = setTimeout(() => {
          setItems(currentItems => currentItems.map((item, i) => i === index ? { ...item, status: 'processing' } : item));
        }, delay);

        delay += 900; // Temps de traitement simulé

        // Marque comme terminé
        let timeout2 = setTimeout(() => {
          setItems(currentItems => currentItems.map((item, i) => i === index ? { ...item, status: 'completed' } : item));
          
          // Si c'est le dernier item
          if (index === initialItems.length - 1) {
            setIsDone(true);
          }
        }, delay);

        timeouts.push(timeout1, timeout2);
      });

      return () => timeouts.forEach(clearTimeout);
    }
  }, [message]);
  
  const progress = (items.filter(i => i.status === 'completed').length / CHECKLIST_ITEMS.length) * 100;

  if (!message || items.length === 0) {
    return null;
  }

  return (
    <div className={`mail-section-loading ${isDone ? 'completed' : ''}`}>
      <LoaderSignature loading={!isDone} success={isDone} />
      <div className="progress-bar-container">
        <div className={`progress-bar ${isDone ? 'completed' : ''}`} style={{ width: `${progress}%` }}></div>
      </div>
      <ul className="checklist">
        {items.map((item, index) => (
          <li key={index} className="check-item" data-status={item.status} style={{ animationDelay: `${index * 100}ms` }}>
            <div className="check-icon">
              {getIconForStatus(item.status)}
            </div>
            <span className="check-text">{item.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MailSection;