import React, { useState } from 'react';
import styles from './SignatureCard.module.css';

export default function SignatureCard({ signature, onCopy }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!signature) return;
    navigator.clipboard.writeText(signature);
    setCopied(true);
    if (onCopy) onCopy();
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <section className={styles.card} aria-label="Signature générée">
      <div className={styles.contentWrap}>
        <div className={styles.label}>Votre signature</div>
        <div className={styles.value} title={signature}>{signature ? `${signature.slice(0,8)}...${signature.slice(-4)}` : ''}</div>
      </div>
      <button
        className={`${styles.copyBtn} ${copied ? styles.copied : ''}`}
        onClick={handleCopy}
        aria-label={copied ? 'Signature copiée !' : 'Copier la signature'}
        type="button"
        tabIndex={0}
      >
        <span className={styles.btnIcon} aria-hidden="true">
          {copied ? (
            <svg viewBox="0 0 24 24" className={styles.checkSvg}><path d="M5 13l4 4L19 7" stroke="#16D9E3" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
          ) : (
            <svg viewBox="0 0 24 24" className={styles.clipboardSvg}><rect x="7" y="4" width="10" height="16" rx="3" fill="#DCEAFE"/><rect x="9" y="2" width="6" height="4" rx="2" fill="#8A7FFF"/><rect x="9" y="8" width="6" height="2" rx="1" fill="#B6B6F7"/></svg>
          )}
        </span>
        <span className={styles.btnText}>
          {copied ? 'Signature copiée !' : 'Copier la signature'}
        </span>
      </button>
    </section>
  );
} 