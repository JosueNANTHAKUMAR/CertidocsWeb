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

const GeneratePage = () => {
  const [expiration, setExpiration] = useState("3600");
  const { isConnected} = useAppKitAccount();
  const { disconnect } = useDisconnect();

  useEffect(() => {
    if (isConnected) {
      // Quand connexion est faite → on notifie le script.js
      window.dispatchEvent(new Event('walletConnected'));
    }
  }, [isConnected]);

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
