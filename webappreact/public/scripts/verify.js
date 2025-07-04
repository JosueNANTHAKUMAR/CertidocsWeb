// Si signer n'est pas déjà défini, on le déclare
if (typeof signer === "undefined") {
    var signer = null;
}
// Si contract n'est pas déjà défini, on le déclare
if (typeof contract === "undefined") {
    var contract = null;
}
if (typeof contractAddress === "undefined") {
    var contractAddress = "0x7b63B543Ee68aa8C9faaAB12Ba73827F6973378f";
}
if (typeof abi === "undefined") {
    var abi = [
        "function verifySignature(bytes32, address, bytes32) external view returns (bool)",
    ];
}
if (typeof urlParams === "undefined") {
    var urlParams = new URLSearchParams(window.location.search);
}
if (typeof messageHashVar === "undefined") {
    var messageHashVar = urlParams.get("messageHash");
}
if (typeof signatureIdVar === "undefined") {
    var signatureIdVar = urlParams.get("signatureId");
}

if (messageHashVar) {
    document.getElementById("messageInput").value = messageHashVar;
}
if (signatureIdVar) {
    document.getElementById("signatureId").value = signatureIdVar.split("[CERTIDOCS]")[1];
}

// Events walletConnected/walletDisconnected (gérés par React/appkit)
window.addEventListener('walletConnected', async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    signer = await provider.getSigner();
    const address = await signer.getAddress();
    contract = new ethers.Contract(contractAddress, abi, signer);
    console.log(address)
    updateUI(address);
});

window.addEventListener('walletDisconnected', () => {
    signer = null;
    contract = null;
    updateUI(null);
});

// Helpers UI (copié/adapté de script.js)
function createAddressSpan(address, addressShort) {
    const addressSpan = document.createElement("span");
    addressSpan.innerText = "🟢 Connecté : " + addressShort;
    addressSpan.title = address;
    addressSpan.classList.add("address-span");
    addressSpan.addEventListener("mouseover", () => {
        addressSpan.innerText = address;
    });
    addressSpan.addEventListener("mouseout", () => {
        addressSpan.innerText = "🟢 Connecté : " + addressShort;
    });
    return addressSpan;
}

function createCopyButton(address) {
    const copyButton = document.createElement("button");
    copyButton.innerHTML = '<i class="fas fa-copy"></i>';
    copyButton.title = "Copier l'adresse";
    copyButton.addEventListener("click", () => {
        navigator.clipboard.writeText(address);
        copyButton.classList.add("icon-transition-out");
        setTimeout(() => {
            copyButton.innerHTML = '<i class="fas fa-check-circle"></i>';
            copyButton.classList.remove("icon-transition-out");
            copyButton.classList.add("icon-transition-in");
            setTimeout(() => {
                copyButton.classList.remove("icon-transition-in");
            }, 200);
        }, 200);
        setTimeout(() => {
            copyButton.classList.add("icon-transition-out-reverse");
            setTimeout(() => {
                copyButton.innerHTML = '<i class="fas fa-copy"></i>';
                copyButton.classList.remove("icon-transition-out-reverse");
                copyButton.classList.add("icon-transition-in-reverse");
                setTimeout(() => {
                    copyButton.classList.remove("icon-transition-in-reverse");
                }, 200);
            }, 200);
        }, 2000);
    });
    return copyButton;
}

function updateUI(address) {
    const accountElement = document.getElementById("account");
    if (!accountElement) return;
    accountElement.innerHTML = "";
    if (address) {
        let addressShort = address.substring(0, 6) + "..." + address.substring(address.length - 4);
        const addressSpan = createAddressSpan(address, addressShort);
        const copyButton = createCopyButton(address);
        accountElement.appendChild(addressSpan);
        accountElement.appendChild(copyButton);
    }
}

// Vérification de la signature (exemple)
async function verifySignature() {
    const signatureId = document.getElementById("signatureId").value.trim();
    if (!/^0x[a-fA-F0-9]{64}$/.test(signatureId)) {
        alert("❌ L'ID de signature est invalide !");
        return;
    }

    const message = document.getElementById("messageInput").value.trim();
    if (message === "") {
        alert("❌ Le message ne peut pas être vide !");
        return;
    }
    messageHash = message;
    const userAddress = await signer.getAddress();
    console.log("Hash du message :", messageHash);
    document.getElementById("verify").innerText = "⏳ Vérification en cours...";
    try {
        const isValid = await contract.verifySignature(
            signatureId,
            userAddress,
            messageHash
        );
        document.getElementById("verify").innerText = isValid
        ? "✅ Signature VALIDE !"
        : "❌ Signature NON VALIDE.";
        console.log(isValid);
    } catch (error) {
        alert(error.message);
        console.error(error);
        document.getElementById("verify").innerText =
        "❌ Erreur lors de la vérification.";
    }
}

// Attache l'event click sur le bouton de vérification après chargement du DOM
document
    .getElementById("verifySignature")
    .addEventListener("click", verifySignature);