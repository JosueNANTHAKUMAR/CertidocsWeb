// src/pages/GeneratePage.js
import React, { useEffect, useState } from "react";
import "../CSS/style.css";
import "../CSS/adresse.css";
import "../CSS/copyButton.css";
import "../CSS/status.css";
import "../CSS/logoutButton.css";
import "../CSS/modern2025.css";
import Container from "../component/Container";
import CustomText from "../component/CustomText";
import CustomTextInput from "../component/CustomTextInput";
import { useAppKitAccount, useDisconnect, modal } from "@reown/appkit/react";
import MailSection from '../component/MailSection';
import TexteSection from '../component/TexteSection';
import Tabs from '../component/Tabs';
import '../component/Tabs.css';
import { FaWallet, FaSignOutAlt, FaCog, FaRegCopy } from "react-icons/fa";
import confetti from "canvas-confetti";

const GeneratePage = () => {
  const [expiration, setExpiration] = useState("3600");
  const { isConnected, address } = useAppKitAccount();
  const { disconnect } = useDisconnect();
  const [activeTab, setActiveTab] = useState(0);
  const [mailMessage, setMailMessage] = useState("");
  const [texteValue, setTexteValue] = useState("");
  const [showTooltip, setShowTooltip] = useState(false);
  const [copyStatus, setCopyStatus] = useState("");

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

  const tabs = [
    {
      label: "Mail",
      content: <MailSection message={mailMessage} />,
    },
    {
      label: "Texte",
      content: <TexteSection value={texteValue} onChange={e => setTexteValue(e.target.value)} />,
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
      <button id="signMessage" className="button" disabled style={{ width: '100%', marginTop: 8, marginBottom: 4, fontSize: 16 }}>
        🖊️ Signer et stocker sur la blockchain
      </button>
      <p id="status" style={{ minHeight: 18, color: 'var(--accent)', fontWeight: 500, fontSize: 13 }}></p>
      <div id="copyMessage"></div>
    </div>
  );
};

export default GeneratePage;
