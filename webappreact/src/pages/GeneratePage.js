import React, { useState } from "react";
import { useEffect } from "react";
import "../CSS/style.css";
import "../CSS/adresse.css";
import "../CSS/copyButton.css";
import "../CSS/status.css";
import "../CSS/logoutButton.css";

const GeneratePage = () => {
  const [message, setMessage] = useState("");
  const [expiration, setExpiration] = useState("3600");
  const [recipients, setRecipients] = useState("");
  const [status] = useState("");
  const [account] = useState(null);



  useEffect(() => {
    const script = document.createElement("script");
    script.src = `${process.env.PUBLIC_URL}/scripts/script.js`
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="container">
      <button id="logoutButton">
        <i className="fas fa-sign-out-alt"></i>
      </button>

      <h2>Générer une signature via MetaMask</h2>
      <p>{account ? `🟢 Connecté : ${account}` : "🔴 Non connecté"}</p>
      
      <h3><i className="fas fa-pen"></i> Message à signer électroniquement :</h3>
      <textarea
        id="messageInput"
        rows="4"
        placeholder="Saisissez votre message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      ></textarea>
      <div id="confirmationMessage"><span className="emoji">✅</span>Votre message a bien été récupéré.</div>

      <h3><i className="fas fa-clock clock-icon"></i> Temps d'expiration :</h3>
      <select
        id="expirationSelect"
        value={expiration}
        onChange={(e) => setExpiration(e.target.value)}
      >
        <option value="3600">1 heure</option>
        <option value="7200">2 heures</option>
        <option value="10800">3 heures</option>
        <option value="86400">1 jour</option>
        <option value="604800">1 semaine</option>
      </select>

      <h3><i className="fas fa-user"></i> Destinataires autorisés :</h3>
      <input
        type="text"
        id="recipientsInput"
        placeholder="Adresse1, Adresse2, ..."
        value={recipients}
        onChange={(e) => setRecipients(e.target.value)}
      />
      <p style={{ fontSize: "12px", fontStyle: "italic" }}>Séparées par des virgules</p>

      <button id="signMessage" disabled>
        🖊️ Signer et stocker sur la blockchain
      </button>
      <p id="status">{status}</p>
      <div id="copyMessage"></div>
    </div>
  );
};

export default GeneratePage;
