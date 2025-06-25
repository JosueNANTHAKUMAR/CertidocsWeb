// src/pages/GeneratePage.js
import React, { useEffect, useState } from "react";
import "../CSS/style.css";
import "../CSS/adresse.css";
import "../CSS/copyButton.css";
import "../CSS/status.css";
import "../CSS/logoutButton.css";
import "../CSS/modern2025.css";
import CustomText from "../component/CustomText";
import CustomTextInput from "../component/CustomTextInput";
import { useAppKitAccount, useDisconnect, modal } from "@reown/appkit/react";
import MailSection from '../component/MailSection';
import TexteSection from '../component/TexteSection';
import Tabs from '../component/Tabs';
import '../component/Tabs.css';
import { FaWallet, FaSignOutAlt, FaCog, FaRegCopy, FaEye, FaEnvelope, FaFont, FaFilePdf, FaImage } from "react-icons/fa";
import confetti from "canvas-confetti";
import LoaderSignature from '../component/LoaderSignature';
import PDFSection from '../component/PdfPage/PDFSection';
import ImageSection from '../component/PdfPage/ImageSection';

const GeneratePage = () => {
  const [expiration, setExpiration] = useState("3600");
  const { isConnected, address } = useAppKitAccount();
  const { disconnect } = useDisconnect();
  const [activeTab, setActiveTab] = useState(0);
  const [mailMessage, setMailMessage] = useState("");
  const [texteValue, setTexteValue] = useState("");
  const [showTooltip, setShowTooltip] = useState(false);
  const [copyStatus, setCopyStatus] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [signing, setSigning] = useState(false);
  const [signed, setSigned] = useState(false);
  const [signature, setSignature] = useState("");
  const [checklistStep, setChecklistStep] = useState(0);
  const [pdfFile, setPdfFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const checklist = [
    "Préparation du message...",
    "Génération de la signature...",
    "Envoi à la blockchain...",
    "Confirmation..."
  ];

  useEffect(() => {
    if (isConnected) {
      // Quand connexion est faite → on notifie le script.js
      window.dispatchEvent(new Event('walletConnected'));
    }
  }, [isConnected]);

  useEffect(() => {
    // Ici, tu dois mettre la logique qui récupère le message de confirmation
    // Par exemple, depuis une API, un state global, etc.
    // Pour l'exemple, on check si le message de confirmation est dans le DOM
    const confirmationDiv = document.getElementById("confirmationMessage");
    if (confirmationDiv && confirmationDiv.style.display !== "none") {
      setMailMessage("Votre message a bien été récupéré.");
      setActiveTab(0); // Onglet Mail par défaut
    } else {
      setMailMessage("");
      setActiveTab(1); // Onglet Texte par défaut
    }
  }, []);

  const handleOpenModal = () => {
    if (!modal) {
      console.error("modal est undefined. Appel à createAppKit manquant ?");
      return;
    }
    modal.open();
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();      
      localStorage.clear();
      console.log("Déconnecté et cache vidé.");
      // On notifie aussi script.js (pour reset UI côté vanilla)
      window.dispatchEvent(new Event('walletDisconnected'));
    } catch (error) {
      console.error("Erreur pendant la déconnexion :", error);
    }
  };

  const launchConfetti = () => {
    confetti({
      particleCount: 32,
      spread: 60,
      origin: { y: 0.3 },
      colors: ["#9584ff", "#b8aaff", "#edeafd", "#7fffa7"],
      scalar: 0.7,
      ticks: 60,
      zIndex: 1000,
    });
  };

  const handleCopy = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopyStatus("copied");
      setShowTooltip(true);
      launchConfetti();
      setTimeout(() => {
        setCopyStatus("");
        setShowTooltip(false);
      }, 1200);
    }
  };

  function isProbablyHash(str) {
    return (
      (str && str.length > 32 && /^[a-f0-9]+$/i.test(str)) ||
      (str && str.length > 32 && /^[A-Za-z0-9+/=]+$/.test(str) && !str.includes(' '))
    );
  }

  const handleSign = async () => {
    setSigning(true);
    setSigned(false);
    setSignature("");
    setChecklistStep(0);
    // Animation checklist
    for (let i = 0; i < checklist.length; i++) {
      setChecklistStep(i);
      await new Promise(res => setTimeout(res, 900));
    }
    // Simule la génération d'une signature
    setSignature("0x" + Math.random().toString(16).slice(2, 66));
    setSigning(false);
    setSigned(true);
    launchConfetti();
  };

  const [copySig, setCopySig] = useState(false);
  const handleCopySignature = () => {
    if (signature) {
      navigator.clipboard.writeText(signature);
      setCopySig(true);
      launchConfetti();
      setTimeout(() => setCopySig(false), 1200);
    }
  };

  const tabs = [
    {
      label: <><span className="tab-icon"><FaEnvelope /></span>Mail</>,
      content: <MailSection message={mailMessage} />,
    },
    {
      label: <><span className="tab-icon"><FaFont /></span>Texte</>,
      content: <TexteSection value={texteValue} onChange={e => setTexteValue(e.target.value)} />,
    },
    {
      label: <><span className="tab-icon"><FaFilePdf /></span>PDF</>,
      content: <PDFSection value={pdfFile} onChange={setPdfFile} />,
    },
    {
      label: <><span className="tab-icon"><FaImage /></span>Image</>,
      content: <ImageSection value={imageFile} onChange={setImageFile} />,
    },
  ];

  return (
    <div className="container">
      <div className="card-3d">
        <div className="title-shimmer">Générer une signature</div>
        <div className="wallet-section-2025">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5em', marginBottom: '0.2em' }}>
            <div style={{ position: "relative" }}>
              <FaWallet
                className="wallet-icon-2025"
                style={{ animation: 'none', fontSize: '1.25em', marginBottom: 0 }}
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                onClick={handleCopy}
                title="Voir l'adresse du wallet"
              />
              {isConnected && address && showTooltip && (
                <div className="wallet-tooltip-2025">
                  {copyStatus === "copied" ? "Copié !" : address}
                </div>
              )}
            </div>
            {isConnected && address && (
              <span className="wallet-badge-2025" style={{ marginBottom: 0 }}>
                {address.slice(0, 6)}...{address.slice(-4)}
                <button
                  className="wallet-copy-btn-2025"
                  onClick={handleCopy}
                  title="Copier mon adresse"
                  tabIndex={0}
                >
                  <FaRegCopy />
                </button>
              </span>
            )}
          </div>
          <div className="wallet-status-row-2025">
            {isConnected && <span className="wallet-dot-2025" title="Connecté"></span>}
            <span className="wallet-status-text-2025">
              {isConnected ? "Connecté" : "Non connecté"}
            </span>
          </div>
          <div className="wallet-btns-row-2025">
            {isConnected ? (
              <>
                <button className="wallet-btn-2025" onClick={handleDisconnect}>
                  <FaSignOutAlt /> Déconnecter
                </button>
                <button className="wallet-btn-2025" onClick={() => modal.open()}>
                  <FaCog /> Gérer mon wallet
                </button>
              </>
            ) : (
              <button className="wallet-btn-2025" onClick={handleOpenModal}>
                <FaWallet /> Connecter le Wallet
              </button>
            )}
          </div>
        </div>
      </div>
      <div style={{ marginBottom: 14 }}>
        <Tabs activeTab={activeTab} onTabChange={setActiveTab} tabs={tabs} />
      </div>
      <div style={{ display: mailMessage ? 'none' : 'block', marginBottom: 14 }}>
        <CustomText className="fas fa-pen custom-text" Text="Message à signer électroniquement :" />
        <CustomTextInput 
          id="messageInput"
          rows="3" 
          placeholder="Saisissez votre message..." 
          value={texteValue} 
          onChange={(e) => setTexteValue(e.target.value)}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <button
            className="button-3d"
            style={{ padding: '0.35em 0.9em', fontSize: '0.97em', minWidth: 0 }}
            onClick={() => setShowPreview(true)}
            disabled={isProbablyHash(texteValue) || !texteValue}
            title={isProbablyHash(texteValue) ? "Message non lisible (hashé)" : "Prévisualiser le message"}
          >
            <FaEye style={{ fontSize: 15 }} />
            Prévisualiser le message
          </button>
        </div>
        {showPreview && (
          <div
            style={{
              position: 'fixed',
              top: 0, left: 0, right: 0, bottom: 0,
              background: 'rgba(30,20,60,0.25)',
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onClick={() => setShowPreview(false)}
          >
            <div
              style={{
                background: '#fff',
                color: '#2d2346',
                borderRadius: 14,
                boxShadow: '0 8px 32px #9584ff33',
                padding: '2em 2.5em',
                minWidth: 280,
                maxWidth: 420,
                maxHeight: '60vh',
                overflowY: 'auto',
                fontSize: '1.1em',
                position: 'relative'
              }}
              onClick={e => e.stopPropagation()}
            >
              <div style={{ fontWeight: 700, marginBottom: 12, color: 'var(--accent)' }}>Prévisualisation du message</div>
              <div style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{texteValue}</div>
              <button
                className="button-3d"
                style={{ position: 'absolute', top: 12, right: 12, padding: '0.2em 0.7em', fontSize: '0.9em' }}
                onClick={() => setShowPreview(false)}
              >
                Fermer
              </button>
            </div>
          </div>
        )}
      </div>
      <div id="confirmationMessage" style={{ display: 'none' }}></div>
      <div style={{ marginBottom: 14 }}>
        <CustomText className="fas fa-clock clock-icon custom-text" Text="Temps d'expiration :" />
        <select id="expirationSelect" value={expiration} onChange={(e) => setExpiration(e.target.value)}>
          <option value="3600">1 heure</option>
          <option value="7200">2 heures</option>
          <option value="10800">3 heures</option>
          <option value="86400">1 jour</option>
          <option value="604800">1 semaine</option>
        </select>
      </div>
      <div style={{ marginBottom: 14 }}>
        <CustomText className="fas fa-user custom-text" Text="Destinataires autorisés :" />
        <CustomTextInput id="recipientsInput" placeholder="Adresse1, Adresse2, ..." />
        <p style={{ fontSize: "11px", fontStyle: "italic", color: 'var(--text-muted)', marginTop: 2 }}>Séparées par des virgules</p>
      </div>
      <button
        id="signMessage"
        className="button-3d"
        disabled={signing || !texteValue || !isConnected}
        style={{ width: '100%', marginTop: 8, marginBottom: 4, fontSize: 16, display: signing ? 'none' : 'block' }}
        onClick={handleSign}
      >
        🖊️ Signer et stocker sur la blockchain
      </button>
      {/* Loader + checklist UX 2025 */}
      {signing && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18, margin: '1.2em 0' }}>
          <LoaderSignature loading={signing} success={signed} />
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, minWidth: 220 }}>
            {checklist.map((step, idx) => (
              <li key={idx} style={{
                color: idx < checklistStep ? '#7fffa7' : idx === checklistStep ? 'var(--accent)' : 'var(--text-muted)',
                fontWeight: idx <= checklistStep ? 600 : 400,
                fontSize: '1.05em',
                marginBottom: 6,
                opacity: idx <= checklistStep ? 1 : 0.6,
                transition: 'color 0.3s, opacity 0.3s',
                display: 'flex', alignItems: 'center', gap: 8
              }}>
                {idx < checklistStep ? <span style={{fontSize:18}}>✔️</span> : idx === checklistStep ? <span style={{fontSize:18}}>⏳</span> : <span style={{fontSize:18}}>•</span>}
                {step}
              </li>
            ))}
          </ul>
        </div>
      )}
      {/* Résultat signature */}
      {signed && signature && (
        <div className="signature-result-2025">
          {/* Check animé */}
          <svg className="signature-check-2025" viewBox="0 0 32 32">
            <path
              d="M7 17 L14 24 L25 9"
              fill="none"
              stroke="#7fffa7"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
          </svg>
          <div>
            <div className="signature-label-2025">
              Votre signature
              <span className="signature-value-2025">
                {signature.slice(0, 8)}...{signature.slice(-4)}
              </span>
            </div>
          </div>
          <button
            className="signature-copy-btn-2025"
            onClick={handleCopySignature}
            style={{ marginLeft: 12, position: 'relative' }}
            title="Copier la signature"
          >
            <FaRegCopy />
            Copier la signature
            {copySig && (
              <span className="signature-copied-tooltip-2025">Copié !</span>
            )}
          </button>
        </div>
      )}
      <p id="status" style={{ minHeight: 18, color: 'var(--accent)', fontWeight: 500, fontSize: 13 }}></p>
      <div id="copyMessage"></div>
    </div>
  );
};

export default GeneratePage;
