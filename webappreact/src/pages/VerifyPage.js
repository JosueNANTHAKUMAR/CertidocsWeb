import React from "react";
import "../CSS/style.css";
import "../CSS/copyButton.css";
import "../CSS/adresse.css";

function VerifyPage() {

    
    return (
    <div className="container">
        <h2>Vérifier une signature via MetaMask</h2>
        <p id="account"></p>

        <h3>Entrez l'ID de la signature :</h3>
        <input type="text" id="signatureId" placeholder="0x..." size="50" />
        <div id="confirmationSignId" className="confirmationMessage">
        <span className="emoji">✅</span>Votre signatureID a bien été récupéré.
        </div>

        <h3>Entrez le message signé :</h3>
        <textarea id="messageInput" rows="4" cols="50" placeholder="Écris le message ici..."></textarea>
        <div id="confirmationMessage">
        <span className="emoji">✅</span>Votre message a bien été récupéré.
        </div>

        <button id="verifySignature">✅ Vérifier la signature</button>
        <p id="verify"></p>
    </div>
    );
}

export default VerifyPage;