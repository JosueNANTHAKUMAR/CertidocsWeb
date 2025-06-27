import React, { useState, useEffect } from "react";
import "../CSS/style.css";
import "../CSS/copyButton.css";
import "../CSS/adresse.css";
import ButtonCustom from "../component/ButtonCustom";
import Container from "../component/Container";
import CustomText from "../component/CustomText";
import CustomTextInput from "../component/CustomTextInput";
import { useAppKitAccount, useDisconnect, modal } from "@reown/appkit/react";
import { FaWallet, FaSignOutAlt, FaCog, FaRegCopy } from "react-icons/fa";

function VerifyPage() {
  const { isConnected, address } = useAppKitAccount();
  const { disconnect } = useDisconnect();
  const [showTooltip, setShowTooltip] = useState(false);
  const [copyStatus, setCopyStatus] = useState("");
  const [signatureId, setSignatureId] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (isConnected) {
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
      window.dispatchEvent(new Event('walletDisconnected'));
    } catch (error) {
      console.error("Erreur pendant la déconnexion :", error);
    }
  };

  const handleCopy = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopyStatus("copied");
      setShowTooltip(true);
      setTimeout(() => {
        setCopyStatus("");
        setShowTooltip(false);
      }, 1200);
    }
  };

  return (
    <Container>
      <div className="title-shimmer" style={{ marginBottom: 18 }}>Vérifier une signature</div>
      <div className="wallet-section-2025" style={{ marginBottom: 28 }}>
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
      <CustomText className="" Text="Entrez l'ID de la signature :" />
      <CustomTextInput
        id="signatureId"
        placeholder="0x..."
        value={signatureId}
        onChange={e => setSignatureId(e.target.value)}
      />
      <CustomText className="" Text="Entrez le message signé :" />
      <CustomTextInput
        id="messageInput"
        rows={4}
        placeholder="Écris le message ici..."
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <ButtonCustom id="verifySignature" style={{ marginTop: 24, width: '100%' }}>
        Vérifier la signature
      </ButtonCustom>
      <p id="verify"></p>
    </Container>
  );
}

export default VerifyPage;
