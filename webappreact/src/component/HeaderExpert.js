import React from 'react';
import './HeaderExpert.css';

const HeaderExpert = () => (
  <header className="header-expert">
    <div className="logo-anim">
      {/* Logo SVG animé (exemple : bouclier stylisé) */}
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="glow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <stop offset="0%" stopColor="#00e0ff" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#9584ff" stopOpacity="0.1" />
          </radialGradient>
        </defs>
        <circle cx="24" cy="24" r="22" fill="url(#glow)" />
        <path d="M24 8L40 14V24C40 34 24 40 24 40C24 40 8 34 8 24V14L24 8Z" fill="#fff" stroke="#9584ff" strokeWidth="2.5"/>
        <path d="M24 8L40 14V24C40 34 24 40 24 40C24 40 8 34 8 24V14L24 8Z" fill="none" stroke="#00e0ff" strokeWidth="2.5" opacity="0.5">
          <animate attributeName="stroke-dasharray" values="0,100;60,100;0,100" dur="2.5s" repeatCount="indefinite" />
        </path>
      </svg>
    </div>
    <div className="header-title">
      <h1>
        <span className="gradient-text">CERTIDOCS</span>
        <span className="shine"></span>
      </h1>
      <p className="header-baseline">La signature électronique de confiance</p>
    </div>
    <div className="header-actions">
      <button className="connect-btn">Se connecter</button>
    </div>
  </header>
);

export default HeaderExpert; 