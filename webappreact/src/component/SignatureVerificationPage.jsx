import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaWallet, FaRegCopy, FaCheckCircle, FaTimesCircle, FaSpinner } from "react-icons/fa";
import styles from "./SignatureVerificationPage.module.css";

function shortAddress(addr) {
  return addr ? addr.slice(0, 6) + "..." + addr.slice(-4) : "";
}

export default function SignatureVerificationPage({
  address = "",
  signatureId = "",
  message = "",
  onVerify,
  checklistSteps = [
    { icon: "🔍", label: "Recherche de l'ID de signature" },
    { icon: "✉️", label: "Extraction du message signé" },
    { icon: "✅", label: "Validation des métadonnées" },
    { icon: "🧠", label: "Préparation à la vérification" },
  ],
  loaderTexts = [
    "Connexion à Gmail sécurisée…",
    "Extraction en cours…",
    "Analyse des métadonnées…",
    "Prêt à vérifier !"
  ],
  ctaDefault = "Vérifier la signature",
  ctaLoading = "En cours...",
  ctaSuccess = "Succès ✅",
  ctaError = "Erreur ❌",
  walletLabel = addr => shortAddress(addr),
  walletStatus = addr => !!addr,
}) {
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [copied, setCopied] = useState(false);
  const [verifStatus, setVerifStatus] = useState(null); // null | 'loading' | 'success' | 'error'
  const [ctaAnim, setCtaAnim] = useState(false);
  const [ctaText, setCtaText] = useState(ctaDefault);
  const [showChecklist, setShowChecklist] = useState(true);
  const ctaRef = useRef();

  // Checklist animation
  useEffect(() => {
    if (step < checklistSteps.length) {
      const t = setTimeout(() => {
        setStep(s => s + 1);
        setProgress(((step + 1) / checklistSteps.length) * 100);
      }, 900);
      return () => clearTimeout(t);
    } else {
      setTimeout(() => setShowChecklist(false), 700);
    }
  }, [step, checklistSteps.length]);

  // Copy wallet
  const handleCopy = () => {
    if (!address) return;
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  // CTA click
  const handleVerify = async () => {
    setVerifStatus("loading");
    setCtaText(ctaLoading);
    setCtaAnim(true);
    try {
      await new Promise(res => setTimeout(res, 1400));
      // Simule la vérification (à remplacer par onVerify si besoin)
      const ok = onVerify ? await onVerify({ address, signatureId, message }) : (signatureId && message && signatureId.startsWith("0x"));
      setVerifStatus(ok ? "success" : "error");
      setCtaText(ok ? ctaSuccess : ctaError);
    } catch {
      setVerifStatus("error");
      setCtaText(ctaError);
    } finally {
      setTimeout(() => setCtaAnim(false), 900);
    }
  };

  // Reset CTA on prop change
  useEffect(() => {
    setVerifStatus(null);
    setCtaText(ctaDefault);
    setCtaAnim(false);
    setShowChecklist(true);
    setStep(0);
    setProgress(0);
  }, [signatureId, message, ctaDefault]);

  // Loader wave dots
  const LoaderWave = () => (
    <div className={styles.waveLoader} aria-label="Chargement en cours">
      <span className={styles.dot} />
      <span className={styles.dot} />
      <span className={styles.dot} />
      <span className={styles.dot} />
    </div>
  );

  return (
    <motion.div
      className={styles.card}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, type: "spring" }}
      tabIndex={0}
      aria-label="Vérification de signature premium"
    >
      {/* Loader + texte contextuel */}
      {showChecklist && (
        <div className={styles.loaderSection}>
          <LoaderWave />
          <div className={styles.loaderText} aria-live="polite">
            {loaderTexts[step] || loaderTexts[loaderTexts.length - 1]}
          </div>
          <div className={styles.progressBar} aria-hidden="true">
            <div className={styles.progress} style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}
      {/* Checklist animée */}
      <AnimatePresence>
        {showChecklist && (
          <motion.ul
            className={styles.checklist}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.13 } },
              exit: { opacity: 0, y: 20, transition: { duration: 0.4 } },
            }}
            aria-label="Analyse du mail en cours…"
            aria-live="polite"
          >
            <div className={styles.checklistTitle}>Analyse du mail en cours…</div>
            {checklistSteps.map((item, idx) => (
              <motion.li
                key={item.label}
                className={
                  idx < step
                    ? styles.checkDone
                    : idx === step
                    ? styles.checkActive
                    : styles.checkIdle
                }
                variants={{
                  hidden: { opacity: 0, x: -20 },
                  visible: { opacity: 1, x: 0 },
                  exit: { opacity: 0, x: 20 },
                }}
                aria-current={idx === step ? "step" : undefined}
              >
                <span className={styles.checkIcon}>{item.icon}</span>
                <span>{item.label}</span>
                {idx < step && <FaCheckCircle className={styles.checkMark} />}
                {idx === step && <FaSpinner className={styles.spinner} />}
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
      {/* Wallet badge */}
      <div className={styles.walletRow}>
        <span className={styles.walletIcon}><FaWallet /></span>
        <span className={styles.walletAddr}>{walletLabel(address)}</span>
        <button
          className={styles.copyBtn}
          onClick={handleCopy}
          aria-label="Copier l'adresse du wallet"
        >
          {copied ? <FaCheckCircle className={styles.copiedIcon} /> : <FaRegCopy />}
        </button>
        <span className={walletStatus(address) ? styles.statusDot : styles.statusDotRed} title={walletStatus(address) ? "Connecté" : "Non connecté"} />
      </div>
      {/* CTA */}
      {!showChecklist && (
        <motion.button
          ref={ctaRef}
          className={styles.ctaBtn + (ctaAnim ? " " + styles.ctaAnim : "")}
          onClick={handleVerify}
          disabled={verifStatus === "loading"}
          whileHover={{ scale: verifStatus ? 1 : 1.04 }}
          whileTap={{ scale: 0.97 }}
          aria-busy={verifStatus === "loading"}
          aria-live="polite"
        >
          <AnimatePresence mode="wait" initial={false}>
            {verifStatus === "loading" ? (
              <motion.span
                key="loading"
                className={styles.ctaContent}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.25 }}
              >
                <FaSpinner className={styles.spinner} /> {ctaLoading}
              </motion.span>
            ) : verifStatus === "success" ? (
              <motion.span
                key="success"
                className={styles.ctaContent}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.25 }}
              >
                <FaCheckCircle className={styles.checkMark} /> {ctaSuccess}
              </motion.span>
            ) : verifStatus === "error" ? (
              <motion.span
                key="error"
                className={styles.ctaContent}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.25 }}
              >
                <FaTimesCircle className={styles.errorMark} /> {ctaError}
              </motion.span>
            ) : (
              <motion.span
                key="default"
                className={styles.ctaContent}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.25 }}
              >
                {ctaDefault}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      )}
    </motion.div>
  );
} 