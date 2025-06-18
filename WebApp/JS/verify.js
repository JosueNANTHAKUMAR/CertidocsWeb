let signer, contract;
const contractAddress = "0x7b63B543Ee68aa8C9faaAB12Ba73827F6973378f"; // 🔥 Remplace par ton contrat
const abi = [
    "function verifySignature(bytes32, address, bytes32) external view returns (bool)",
];

const urlParams = new URLSearchParams(window.location.search);
let messageHashVar = urlParams.get("messageHash");
let signatureIdVar = urlParams.get("signatureId");

if (messageHashVar) {
    document.getElementById("messageInput").value = messageHashVar;
}
if (signatureIdVar) {
    document.getElementById("signatureId").value = signatureIdVar.split("[CERTIDOCS]")[1];
}

async function connectWallet() {
    if (typeof window.ethereum === "undefined") {
        alert(
            "❌ Wallet non détecté ! Essaie d'actualiser la page ou vérifie ton installation."
        );
        return;
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    signer = await provider.getSigner();
    const address = await signer.getAddress();
    let addressShort =
        address.substring(0, 6) + "..." + address.substring(address.length - 4);
    const accountElement = document.getElementById("account");
    accountElement.innerHTML = `
        <div style="display: flex; align-items: center; font-size: 0.9em;">
        </div>
    `;

    const addressSpan = createAddressSpan(address, addressShort);
    accountElement.querySelector("div").appendChild(addressSpan);

    const copyButton = createCopyButton(address);
    accountElement.querySelector("div").appendChild(copyButton);

    contract = new ethers.Contract(contractAddress, abi, signer);
    document.getElementById("signMessage").disabled = true;
}

function createAddressSpan(address, addressShort) {
    const addressSpan = document.createElement("span");
    addressSpan.innerText = "🟢 Connecté : " + addressShort;
    addressSpan.title = address;
    addressSpan.classList.add("address-span");
    addressSpan.style.width = "310px";

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
    copyButton.style.fontWeight = "bold";
    copyButton.style.display = "flex";
    copyButton.style.alignItems = "center";
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
    document.getElementById("status").innerText = "⏳ Vérification en cours...";
    try {
        const isValid = await contract.verifySignature(
            signatureId,
            userAddress,
            messageHash
        );
        document.getElementById("status").innerText = isValid
            ? "✅ Signature VALIDE !"
            : "❌ Signature NON VALIDE.";
        console.log(isValid);
    } catch (error) {
        console.error(error);
        document.getElementById("status").innerText =
            "❌ Erreur lors de la vérification.";
    }
}

document
    .getElementById("verifySignature")
    .addEventListener("click", verifySignature);
document.addEventListener("DOMContentLoaded", connectWallet);
