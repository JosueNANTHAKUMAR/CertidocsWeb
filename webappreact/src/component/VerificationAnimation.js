import React, { useState, useEffect } from 'react';
import { FaShieldAlt, FaCheckCircle, FaTimesCircle, FaSpinner } from 'react-icons/fa';
import './VerificationAnimation.css';

const VerificationAnimation = ({ isVerifying, result, onComplete }) => {
    const [step, setStep] = useState(0);
    const [progress, setProgress] = useState(0);

    const verificationSteps = [
        { icon: "🔍", label: "Analyse de la signature", color: "#9584ff" },
        { icon: "🔐", label: "Vérification blockchain", color: "#7fffa7" },
        { icon: "⚡", label: "Validation cryptographique", color: "#ffd93d" },
        { icon: "✅", label: "Résultat final", color: "#4CAF50" }
    ];

    useEffect(() => {
        if (isVerifying) {
            setStep(0);
            setProgress(0);

            const interval = setInterval(() => {
                setStep(prev => {
                    if (prev < verificationSteps.length - 1) {
                        setProgress(((prev + 1) / verificationSteps.length) * 100);
                        return prev + 1;
                    } else {
                        clearInterval(interval);
                        return prev;
                    }
                });
            }, 800);

            return () => clearInterval(interval);
        }
    }, [isVerifying, verificationSteps.length]);

    useEffect(() => {
        if (result && onComplete) {
            // Ne plus appeler onComplete automatiquement pour garder le résultat affiché
            // setTimeout(() => {
            //   onComplete();
            // }, 2000);
        }
    }, [result, onComplete]);

    if (!isVerifying && !result) {
        return null;
    }

    return (
        <div className="verification-animation-container" style={{ marginTop: isVerifying ? '20px' : '0' }}>
            {isVerifying && (
                <div className="verification-loading">
                    <div className="verification-header">
                        <div className="verification-icon-container">
                            <FaShieldAlt className="verification-main-icon" />
                            <div className="verification-pulse-ring"></div>
                        </div>
                        <h3 className="verification-title">Vérification en cours</h3>
                        <p className="verification-subtitle">Analyse de votre signature électronique</p>
                    </div>
                </div>
            )}

            {result && (
                <div className={`verification-result ${result === 'success' ? 'success' : 'error'}`}>
                    <div className="result-icon-container">
                        {result === 'success' ? (
                            <FaCheckCircle className="result-icon success" />
                        ) : (
                            <FaTimesCircle className="result-icon error" />
                        )}
                        <div className="result-pulse-ring"></div>
                    </div>

                    <h3 className="result-title">
                        {result === 'success' ? 'Signature Validée !' : 'Signature Invalide'}
                    </h3>

                    <p className="result-message">
                        {result === 'success'
                            ? 'Votre signature électronique est authentique et valide.'
                            : 'La signature ne correspond pas ou l\'ID est incorrect.'
                        }
                    </p>

                    <div className="result-details">
                        <div className="result-detail-item">
                            <span className="detail-label">Statut :</span>
                            <span className={`detail-value ${result === 'success' ? 'success' : 'error'}`}>
                                {result === 'success' ? 'Authentique' : 'Non authentique'}
                            </span>
                        </div>
                        <div className="result-detail-item">
                            <span className="detail-label">Timestamp :</span>
                            <span className="detail-value">{new Date().toLocaleTimeString()}</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VerificationAnimation; 