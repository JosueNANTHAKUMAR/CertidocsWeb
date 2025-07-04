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
import Tabs from "../component/Tabs";
import "../component/Tabs.css";
import PDFSection from "../component/PdfPage/PDFSection";
import ImageSection from "../component/PdfPage/ImageSection";

function VerifyPage() {
  const { isConnected, address } = useAppKitAccount();
  const { disconnect } = useDisconnect();
  const [showTooltip, setShowTooltip] = useState(false);
  const [copyStatus, setCopyStatus] = useState("");
  const [signatureId, setSignatureId] = useState("");
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const [texte1, setTexte1] = useState("");
  const [texte2, setTexte2] = useState("");
  const [pdfFile, setPdfFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [mailContentLost, setMailContentLost] = useState(false);
  const [originalMailContent, setOriginalMailContent] = useState({ signatureId: "", message: "" });
  const [hasVisitedOtherTab, setHasVisitedOtherTab] = useState(false);
  const [isReloading, setIsReloading] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [isRecoveringMail, setIsRecoveringMail] = useState(true);
  const [recoveryStep, setRecoveryStep] = useState(0);
  const recoverySteps = [
    "Connexion au serveur mail...",
    "Récupération des données...",
    "Analyse du contenu...",
    "Extraction de la signature...",
    "Prêt pour validation !"
  ];

  useEffect(() => {
    if (isConnected) {
      window.dispatchEvent(new Event('walletConnected'));
    }
  }, [isConnected]);

  useEffect(() => {
    if (signatureId && message && !originalMailContent.signatureId) {
      setOriginalMailContent({ signatureId, message });
    }
  }, [signatureId, message, originalMailContent.signatureId]);

  useEffect(() => {
    console.log("Check mail content lost:", { activeTab, hasVisitedOtherTab, signatureId, message });
    if (activeTab === 0 && hasVisitedOtherTab && (!signatureId || !message)) {
      console.log("Mail content lost detected!");
      setMailContentLost(true);
    } else {
      setMailContentLost(false);
    }
  }, [activeTab, signatureId, message, hasVisitedOtherTab]);

  useEffect(() => {
    if (activeTab !== 0) {
      console.log("Visiting other tab, setting hasVisitedOtherTab to true");
      setHasVisitedOtherTab(true);
    }
  }, [activeTab]);

  useEffect(() => {
    const checkVerificationResult = () => {
      const verifyElement = document.getElementById("verify");
      if (verifyElement) {
        const text = verifyElement.innerText;
        if (text.includes("✅ Signature VALIDE")) {
          setShowSuccessMessage(true);
          setShowErrorMessage(false);
          verifyElement.style.display = 'none';
          setTimeout(() => setShowSuccessMessage(false), 5000);
        } else if (text.includes("❌ Signature NON VALIDE") || text.includes("❌ Erreur")) {
          setShowErrorMessage(true);
          setShowSuccessMessage(false);
          verifyElement.style.display = 'none';
          setTimeout(() => setShowErrorMessage(false), 5000);
        }
      }
    };

    const interval = setInterval(checkVerificationResult, 500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const startRecovery = async () => {
      setIsRecoveringMail(true);
      setRecoveryStep(0);
      
      for (let i = 0; i < recoverySteps.length; i++) {
        setRecoveryStep(i);
        await new Promise(resolve => setTimeout(resolve, 800));
      }
      
      // Simule la récupération des données
      setSignatureId("0x" + Math.random().toString(16).slice(2, 66));
      setMessage("Message récupéré automatiquement depuis votre boîte mail");
      setIsRecoveringMail(false);
    };
    
    if (activeTab === 0) {
      startRecovery();
    }
  }, [activeTab]);

  const handleReloadMailContent = () => {
    console.log("Rechargement de la page...");
    console.log("Button clicked, reloading...");
    setIsReloading(true);
    setTimeout(() => {
      document.location.reload();
    }, 100);
  };

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

  const tabs = [
    {
      label: "Mail",
      content: (
        <>
          {console.log("Rendering mail tab, mailContentLost:", mailContentLost)}
          {isRecoveringMail && (
            <div style={{ padding: '32px 20px', textAlign: 'center' }}>
              <div style={{
                width: '80px',
                height: '80px',
                border: '6px solid #f3f3f3',
                borderTop: '6px solid #9584ff',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 24px'
              }}></div>
              <div style={{ fontSize: '20px', fontWeight: '600', color: '#333', marginBottom: '16px' }}>
                Récupération automatique en cours...
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, maxWidth: '400px', margin: '0 auto' }}>
                {recoverySteps.map((step, idx) => (
                  <li key={idx} style={{
                    color: idx < recoveryStep ? '#4CAF50' : idx === recoveryStep ? '#9584ff' : '#999',
                    fontWeight: idx <= recoveryStep ? 600 : 400,
                    fontSize: '16px',
                    marginBottom: '12px',
                    opacity: idx <= recoveryStep ? 1 : 0.6,
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}>
                    {idx < recoveryStep ? <span style={{fontSize:20}}>✅</span> : 
                     idx === recoveryStep ? <span style={{fontSize:20}}>⏳</span> : 
                     <span style={{fontSize:20}}>⭕</span>}
                    {step}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {signatureId && message && !isRecoveringMail && (
            <div style={{ textAlign: 'center', padding: '32px 20px' }}>
              <div style={{ fontSize: '22px', fontWeight: '600', color: '#333', marginBottom: '16px' }}>
                ✅ Contenu récupéré avec succès !
              </div>
              <div style={{ color: '#666', marginBottom: '32px', lineHeight: '1.6' }}>
                Signature et message extraits de votre boîte mail.<br/>
                Cliquez sur le bouton ci-dessous pour vérifier votre signature
              </div>
            </div>
          )}

          {showSuccessMessage && (
            <div style={{
              padding: '32px 20px',
              textAlign: 'center',
              background: 'linear-gradient(135deg, #4CAF50, #45a049)',
              borderRadius: '16px',
              color: 'white',
              margin: '20px 0',
              boxShadow: '0 8px 32px rgba(76, 175, 80, 0.3)'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎉</div>
              <div style={{ fontSize: '24px', fontWeight: '700', marginBottom: '12px' }}>
                Signature Validée !
              </div>
              <div style={{ fontSize: '16px', opacity: 0.9, lineHeight: '1.6' }}>
                Votre signature électronique est authentique et valide.<br/>
                Le document a été vérifié avec succès.
              </div>
            </div>
          )}

          {showErrorMessage && (
            <div style={{
              padding: '32px 20px',
              textAlign: 'center',
              background: 'linear-gradient(135deg, #f44336, #d32f2f)',
              borderRadius: '16px',
              color: 'white',
              margin: '20px 0',
              boxShadow: '0 8px 32px rgba(244, 67, 54, 0.3)'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>❌</div>
              <div style={{ fontSize: '24px', fontWeight: '700', marginBottom: '12px' }}>
                Signature Invalide !
              </div>
              <div style={{ fontSize: '16px', opacity: 0.9, lineHeight: '1.6' }}>
                La signature ne correspond pas au message<br/>
                ou l'ID de signature est incorrect.
              </div>
            </div>
          )}

          {mailContentLost && (
            <div style={{ marginBottom: 16, padding: 16, backgroundColor: '#f0eaff', borderRadius: 8, border: '2px solid #9584ff', boxShadow: '0 2px 8px rgba(149, 132, 255, 0.2)' }}>
              <div style={{ color: '#9584ff', fontWeight: 500, marginBottom: 8 }}>
                Contenu mail perdu
              </div>
              <button 
                onClick={handleReloadMailContent}
                style={{ backgroundColor: '#9584ff', color: 'white', border: 'none', padding: '12px 24px', fontSize: '16px', fontWeight: '600', borderRadius: '8px', cursor: 'pointer' }}
              >
                Recharger le contenu mail
              </button>
            </div>
          )}
          {/* Champs cachés mais toujours présents pour la logique */}
          <div style={{ display: 'none' }}>
            <CustomTextInput
              id="signatureId"
              placeholder="0x..."
              value={signatureId}
              onChange={e => setSignatureId(e.target.value)}
            />
            <CustomTextInput
              id="messageInput"
              rows={4}
              placeholder="Écris le message ici..."
              value={message}
              onChange={e => setMessage(e.target.value)}
            />
          </div>
          <ButtonCustom id="verifySignature" style={{ marginTop: 24, width: '100%' }}>
            Vérifier la signature
          </ButtonCustom>
          <p id="verify" style={{ display: 'none' }}></p>
        </>
      ),
    },
    {
      label: "Texte",
      content: (
        <div style={{ padding: 18 }}>
          <CustomText className="" Text="Votre Signature ID :" />
          <CustomTextInput
            id="texte1"
            placeholder="Entrez ici l'identifiant unique de votre signature..."
            value={texte1}
            onChange={e => setTexte1(e.target.value)}
            style={{ marginBottom: 16 }}
          />
          <CustomText className="" Text="Message signé :" />
          <CustomTextInput
            id="texte2"
            placeholder="Collez ici le message signé..."
            value={texte2}
            onChange={e => setTexte2(e.target.value)}
          />
          <ButtonCustom id="verifySignatureTexte" style={{ marginTop: 24, width: '100%' }}>
            Vérifier la signature
          </ButtonCustom>
        </div>
      ),
    },
    {
      label: "PDF",
      content: (
        <div style={{ padding: 18 }}>
          <PDFSection value={pdfFile} onChange={setPdfFile} />
          <ButtonCustom id="verifySignaturePdf" style={{ marginTop: 24, width: '100%' }}>
            Vérifier la signature PDF
          </ButtonCustom>
        </div>
      ),
    },
    {
      label: "Image",
      content: (
        <div style={{ padding: 18 }}>
          <ImageSection value={imageFile} onChange={setImageFile} />
          <ButtonCustom id="verifySignatureImage" style={{ marginTop: 24, width: '100%' }}>
            Vérifier la signature Image
          </ButtonCustom>
        </div>
      ),
    },
  ];

  if (isReloading) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '20px',
          padding: '40px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)',
          textAlign: 'center',
          maxWidth: '400px',
          backdropFilter: 'blur(20px)'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #667eea',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          <div style={{
            fontSize: '24px',
            fontWeight: '600',
            color: '#333',
            marginBottom: '12px'
          }}>
            Rechargement en cours...
          </div>
          <div style={{
            fontSize: '16px',
            color: '#666',
            lineHeight: '1.5'
          }}>
            Récupération du contenu mail
          </div>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    );
  }

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
      <Tabs activeTab={activeTab} onTabChange={setActiveTab} tabs={tabs} />
    </Container>
  );
}

export default VerifyPage;
