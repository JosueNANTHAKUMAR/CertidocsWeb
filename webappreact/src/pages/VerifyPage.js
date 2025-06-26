import React from "react";
import "../CSS/style.css";
import "../CSS/copyButton.css";
import "../CSS/adresse.css";
import ButtonCustom from "../component/ButtonCustom";
import Container from "../component/Container";
import CustomText from "../component/CustomText";
import CustomTextInput from "../component/CustomTextInput";

function VerifyPage() {
  return (
    <Container>
      <CustomText className="" Text="Vérifier une signature" />
      <p id="account"></p>
      
      <CustomText className="" Text="Entrez l'ID de la signature :" />
      <CustomTextInput id="signatureId" placeholder="0x..." />
      <div id="confirmationSignId" className="confirmationMessage">
        <span className="emoji">✅</span>Votre signatureID a bien été récupéré.
      </div>
      
      <CustomText className="" Text="Entrez le message signé :" />
      <CustomTextInput id="messageInput" rows="4" placeholder="Écris le message ici..." />
      <div id="confirmationMessage">
        <span className="emoji">✅</span>Votre message a bien été récupéré.
      </div>
      
      <ButtonCustom id="verifySignature">✅ Vérifier la signature</ButtonCustom>
      <p id="verify"></p>
    </Container>
  );
}

export default VerifyPage;
