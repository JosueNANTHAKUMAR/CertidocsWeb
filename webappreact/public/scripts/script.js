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
        "function storeSignature(bytes32, uint256, address[], bytes) external",
    ];
}

window.addEventListener('walletConnected', async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    signer = await provider.getSigner();
    const address = await signer.getAddress();
    console.log(address);
    contract = new ethers.Contract(contractAddress, abi, signer);
    console.log("✅ Connexion établie via script.js :", { provider, signer, address, contract });

    updateUI(address);
    document.getElementById("signMessage").disabled = false;
});

window.addEventListener('walletDisconnected', () => {
    signer = null;
    contract = null;
    updateUI(null);
    document.getElementById("signMessage").disabled = true;
});

async function hideTextInImage(imageUrl, text) {
    const img = new Image();
    img.crossOrigin = "anonymous"; // Évite les problèmes de CORS
    img.src = imageUrl;

    return new Promise((resolve, reject) => {
        img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0);

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;

            // Convertir le texte en binaire
            const binaryText = text.split('').map(char => {
                return char.charCodeAt(0).toString(2).padStart(8, '0');
            }).join('') + '00000000'; // Ajouter un marqueur de fin

            // Cacher les données dans les pixels
            for (let i = 0; i < binaryText.length; i++) {
                if (i * 4 < data.length) {
                    data[i * 4] = (data[i * 4] & 0xFE) | parseInt(binaryText[i], 2);
                } else {
                    break;
                }
            }
            ctx.putImageData(imageData, 0, 0);

            // Copier l'image modifiée dans le presse-papiers
            canvas.toBlob(blob => {
                const item = new ClipboardItem({ "image/png": blob });
                navigator.clipboard.write([item]).then(() => resolve("Image copiée dans le presse-papiers"))
                    .catch(reject);
            }, "image/png");
        };

        img.onerror = () => reject("Erreur de chargement de l'image");
    });
}

// retrieve the variable inside url wich is formatted like localhost:8080/?messageHash=0x1234567890
if (typeof urlParams === "undefined") {
    var urlParams = new URLSearchParams(window.location.search);
}
if (typeof messageHash === "undefined") {
    var messageHash = urlParams.get("messageHash");
}

if (messageHash) {
    document.getElementById("messageInput").value = messageHash;
    document.getElementById("messageInput").style.display = "none";
    document.getElementById("confirmationMessage").style.display = "block";
} else {
    document.getElementById("confirmationMessage").style.display = "none";
}

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
        // alert("🎉 Adresse copiée !");
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
    const accountContainer = document.getElementById("account");
    if (!accountContainer) return;

    accountContainer.innerHTML = "";

    if (address) {
        let addressShort = address.substring(0, 6) + "..." + address.substring(address.length - 4);
        const addressSpan = createAddressSpan(address, addressShort);
        const copyButton = createCopyButton(address);
        accountContainer.appendChild(addressSpan);
        accountContainer.appendChild(copyButton);

        // Affiche le bouton "signer"
        const signBtn = document.getElementById("signMessage");
        if (signBtn) signBtn.disabled = false;

    } else {
        // Si déconnecté → on vide simplement l'UI (pas de bouton "connecter MetaMask")
        const signBtn = document.getElementById("signMessage");
        if (signBtn) signBtn.disabled = true;
    }
}

async function signMessage() {
    const message = document.getElementById("messageInput").value.trim();
    if (message === "") {
        alert("❌ Le message ne peut pas être vide !");
        return;
    }

    const recipientsInput = document
        .getElementById("recipientsInput")
        .value.trim();
    if (recipientsInput === "") {
        alert("❌ Veuillez entrer au moins une adresse de destinataire !");
        return;
    }

    let authorizedRecipients = recipientsInput
        .split(",")
        .map((addr) => addr.trim().toLowerCase());

    if (!authorizedRecipients.every((addr) => /^0x[a-fA-F0-9]{40}$/.test(addr))) {
        alert("❌ Une ou plusieurs adresses de destinataires sont invalides !");
        return;
    }

    const messageHash = message;
    const signature = await signer.signMessage(ethers.getBytes(messageHash));
    console.log("hash:", messageHash);

    const expirationSelect = document.getElementById("expirationSelect");
    const expiration = Math.floor(Date.now() / 1000) + parseInt(expirationSelect.value);

    console.log("📩 Données envoyées à storeSignature:");
    console.log("→ messageHash:", messageHash);
    console.log("→ signature:", signature);
    console.log("→ authorizedRecipients:", authorizedRecipients);
    console.log("→ expiration:", expiration);
    console.log("→ contractAddress:", contractAddress);

    document.getElementById("status").innerHTML =
        '<div class="loader"></div>⏳ Transaction en cours...';
    document.getElementById("status").style.display = "flex";

    requestAnimationFrame(async () => {
        try {
            const tx = await contract.storeSignature(
                messageHash,
                expiration,
                authorizedRecipients,
                signature
            );
            const receipt = await tx.wait();
            let signatureId = null;

            for (const log of receipt.logs) {
                if (log.topics.length > 1) {
                    signatureId = log.topics[1];
                    break;
                }
            }

            if (!signatureId) {
                console.error("❌ Impossible de récupérer `signatureId` !");
                return;
            }

            let signatureIdString = "";
            for (let i = 0; i < 6; i++) {
                signatureIdString += signatureId[i];
            }
            signatureIdString += "...";
            for (let i = signatureId.length - 4; i < signatureId.length; i++) {
                signatureIdString += signatureId[i];
            }
            document.getElementById("status").innerText =
                "✅ Votre signature : " + signatureIdString;

            const copyButton = document.createElement("button");
            copyButton.className = "copy-button";
            copyButton.innerText = "📋 Copié la signature !";
            document.getElementById("status").appendChild(copyButton);
            copyButton.onclick = () => {
                hideTextInImage("http://localhost:8080/DEFAULT_SIGNATURE.png", "[CERTIDOCS]" + signatureId).then(() => {
                    const confirmationMessage = document.createElement("div");
                    confirmationMessage.className = "copy-confirmation";
                    confirmationMessage.innerText = "✅ Signature copiée !";
                    document.getElementById("status").appendChild(confirmationMessage);
                    confirmationMessage.style.display = "block";
                    setTimeout(() => {
                        copyButton.innerText = "📋 Copier la signature";
                        confirmationMessage.style.display = "none";
                    }, 2000);
                }).catch((error) => {
                    console.error(error);
                    alert("❌ Erreur lors de la copie de la signature !");
                });
            };
            document.getElementById("status").appendChild(copyButton);
        } catch (error) {
            console.error(error);
            document.getElementById("status").innerText = "❌ Erreur lors du stockage.";
        }
    });
}

document.getElementById("signMessage").addEventListener("click", signMessage);
// document.addEventListener("DOMContentLoaded", connectMetaMask);