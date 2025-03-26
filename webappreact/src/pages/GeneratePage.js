import React, { useState } from "react";
import "../CSS/style.css";
import "../CSS/adresse.css";
import "../CSS/copyButton.css";
import "../CSS/status.css";
import "../CSS/logoutButton.css";
import ButtonCustom from "../component/ButtonCustom";
import Container from "../component/Container";
import CustomText from "../component/CustomText";
import CustomTextInput from "../component/CustomTextInput";

const GeneratePage = () => {
  const [expiration, setExpiration] = useState("3600");

  return (
    <Container>
      <ButtonCustom id="logoutButton" className="logout-button">
        <i className="fas fa-sign-out-alt"></i>
      </ButtonCustom>
      
      <CustomText className="" Text="Générer une signature via MetaMask" />
      <p id="account"></p>
      
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
      
      <ButtonCustom id="signMessage" disabled>
        🖊️ Signer et stocker sur la blockchain
      </ButtonCustom>
      
      <p id="status"></p>
      <div id="copyMessage"></div>
    </Container>
  );
};

export default GeneratePage;
