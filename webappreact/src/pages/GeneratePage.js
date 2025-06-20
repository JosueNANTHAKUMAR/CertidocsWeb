// src/pages/GeneratePage.js
import React, { useEffect, useState } from "react";
import "../CSS/style.css";
import "../CSS/adresse.css";
import "../CSS/copyButton.css";
import "../CSS/status.css";
import "../CSS/logoutButton.css";
import Container from "../component/Container";
import CustomText from "../component/CustomText";
import CustomTextInput from "../component/CustomTextInput";
import { useAppKitAccount, useDisconnect, modal } from "@reown/appkit/react";
import MailSection from '../component/MailSection';
import TexteSection from '../component/TexteSection';
import Tabs from '../component/Tabs';
import '../component/Tabs.css';

const GeneratePage = () => {
  const [expiration, setExpiration] = useState("3600");
  const { isConnected} = useAppKitAccount();
  const { disconnect } = useDisconnect();
  const [activeTab, setActiveTab] = useState(0);
  const [mailMessage, setMailMessage] = useState("");
  const [texteValue, setTexteValue] = useState("");

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

  const tabs = [
    {
      label: "Mail",
      content: <MailSection message={mailMessage || "Votre message a bien été récupéré."} />,
    },
    {
      label: "Texte",
      content: <TexteSection value={texteValue} onChange={e => setTexteValue(e.target.value)} />,
    },
  ];

  return (
    <Container>
      <CustomText className="" Text="Générer une signature" />
      <p id="account"></p>
      <div style={{ padding: 10, marginBottom: 20 }}>
        <h2>Connexion Wallet</h2>
        {isConnected ? (
          <>
            <button onClick={handleDisconnect}>Déconnecter</button>
            <button onClick={() => modal.open()}>Gérer mon wallet</button>
          </>
        ) : (
          <button onClick={handleOpenModal}>Connecter le Wallet</button>
        )}
      </div>

      {/* Onglets Mail / Texte juste sous le bouton Gérer mon wallet */}
      <Tabs activeTab={activeTab} onTabChange={setActiveTab} tabs={tabs} />

      <CustomText className="fas fa-pen" Text="Message à signer électroniquement :" />
      <CustomTextInput id="messageInput" rows="4" placeholder="Saisissez votre message..." />

      <div id="confirmationMessage">
        <span className="emoji">✅</span>Votre message a bien été récupéré.
      </div>

      <CustomText className="fas fa-clock clock-icon" Text="Temps d'expiration :" />
      <select id="expirationSelect" value={expiration} onChange={(e) => setExpiration(e.target.value)}>
        <option value="3600">1 heure</option>
        <option value="7200">2 heures</option>
        <option value="10800">3 heures</option>
        <option value="86400">1 jour</option>
        <option value="604800">1 semaine</option>
      </select>

      <CustomText className="fas fa-user" Text="Destinataires autorisés :" />
      <CustomTextInput id="recipientsInput" placeholder="Adresse1, Adresse2, ..." />
      <p style={{ fontSize: "12px", fontStyle: "italic" }}>Séparées par des virgules</p>

      <button id="signMessage" disabled>
        🖊️ Signer et stocker sur la blockchain
      </button>

      <p id="status"></p>
      <div id="copyMessage"></div>
    </Container>
  );
};

export default GeneratePage;
