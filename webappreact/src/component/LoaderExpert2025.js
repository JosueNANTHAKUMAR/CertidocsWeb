import React, { useEffect, useState } from "react";
import "./LoaderExpert2025.css";

const loadingSteps = [
  "Analyse du contenu...",
  "Vérification de la sécurité...",
  "Optimisation des données...",
  "Génération de la signature...",
  "Finalisation..."
];

const LoaderExpert2025 = ({ onFinish }) => {
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (step < loadingSteps.length) {
      const timeout = setTimeout(() => {
        setStep(step + 1);
        setProgress(((step + 1) / loadingSteps.length) * 100);
      }, 900);
      return () => clearTimeout(timeout);
    } else {
      setTimeout(() => {
        onFinish();
      }, 600);
    }
  }, [step, onFinish]);

  return (
    <div className="loader-expert-overlay">
      <div className="loader-expert-container">
        <div className="loader-spinner"></div>
        <div className="loader-text">{loadingSteps[step] || "Prêt !"}</div>
        <div className="loader-progress-bar">
          <div
            className="loader-progress"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default LoaderExpert2025; 