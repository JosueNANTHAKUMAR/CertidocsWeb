import React, { useEffect, useState } from 'react';
import './LoaderSignature.css';

export default function LoaderSignature({ loading, success }) {
  const [showCheck, setShowCheck] = useState(false);

  useEffect(() => {
    if (success) {
      setTimeout(() => setShowCheck(true), 400);
    } else {
      setShowCheck(false);
    }
  }, [success]);

  return (
    <div className="loader-signature-container">
      {!showCheck ? (
        <svg className="loader-svg" viewBox="0 0 60 60">
          <defs>
            <linearGradient id="loader-gradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#9584ff" />
              <stop offset="100%" stopColor="#b8aaff" />
            </linearGradient>
          </defs>
          <circle
            className="loader-ring"
            cx="30"
            cy="30"
            r="24"
            fill="none"
            stroke="url(#loader-gradient)"
            strokeWidth="5"
          />
          <path
            className="loader-squiggle"
            d="M18 32 Q30 10 42 32"
            fill="none"
            stroke="url(#loader-gradient)"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      ) : (
        <svg className="loader-svg" viewBox="0 0 60 60">
          <defs>
            <linearGradient id="check-gradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#9584ff" />
              <stop offset="100%" stopColor="#7fffa7" />
            </linearGradient>
          </defs>
          <circle
            className="loader-ring-fade"
            cx="30"
            cy="30"
            r="24"
            fill="none"
            stroke="url(#check-gradient)"
            strokeWidth="5"
          />
          <path
            className="loader-check"
            d="M20 32 L28 40 L42 22"
            fill="none"
            stroke="url(#check-gradient)"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </svg>
      )}
    </div>
  );
} 