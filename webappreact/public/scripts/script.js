// Si signer n'est pas déjà défini, on le déclare
if (typeof signer === "undefined") {
    var signer = null;
}
// Si contract n'est pas déjà défini, on le déclare
if (typeof contract === "undefined") {
    var contract = null;
}
if (typeof contractAddress === "undefined") {
    var contractAddress = "0x6515cc2007BF39BF74bc561d054D228325223A2A";
}
if (typeof abi === "undefined") {
    var abi = [
        "function storeSignature(bytes32, uint256, address[], bytes, uint256) external",
    ];
}

// Configuration de l'URL de base selon l'environnement
const baseUrl = (() => {
    // Détection de l'environnement basée sur l'URL actuelle
    const hostname = window.location.hostname;
    const protocol = window.location.protocol;
    
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        // Environnement de développement
        return 'http://localhost:3002';
    } else {
        // Environnement de production
        return 'https://certidocsweb-yf6fjg.dappling.network';
    }
})();

let currentTab = 0; // 0 = mail, 1 = Texte, 2 = PDF, 3 = Image
let currentPDFFile = null;
let currentImageFile = null;

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

async function hideTextInImageReturnBlob(imageUrl, text) {
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
            // Copier l'image modifiée dans un blob
            canvas.toBlob(blob => {
                if (blob) {
                    resolve(blob);
                } else {
                    reject("Erreur lors de la création du blob");
                }
            }, "image/png");
        };
        img.onerror = () => reject("Erreur de chargement de l'image");
    });
}

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

// retrieve the variable inside url wich is formatted like https://certidocsweb-yf6fjg.dappling.network/?messageHash=0x1234567890
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

function readFileAsArrayBuffer(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
    });
}


async function signMessage() {
    let messageHash;
    let message;
    let signature;
    let authorizedRecipients = [];
    let isString = false;
    isString = document.getElementById("signatureCheckbox").checked;
    if (currentTab === 0 || currentTab === 1) {
        message = document.getElementById("messageInput").value.trim();
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

        authorizedRecipients = recipientsInput
            .split(",")
            .map((addr) => addr.trim().toLowerCase());

        if (!authorizedRecipients.every((addr) => /^0x[a-fA-F0-9]{40}$/.test(addr))) {
            alert("❌ Une ou plusieurs adresses de destinataires sont invalides !");
            return;
        }
        if (!ethers.isBytesLike(message)) {
            // hash message using keccak256
            const hash = ethers.keccak256(ethers.toUtf8Bytes(message));
            console.log("Message non hashé, hash en cours...");
            console.log("Message hashé :", hash);
            messageHash = hash;
        } else {
            // if message is already a bytes-like value, use it directly
            messageHash = message;
            console.log("Message déjà hashé :", messageHash);
        }

        signature = await signer.signMessage(ethers.getBytes(messageHash));
        console.log("hash:", messageHash);
    } else if (currentTab === 2) {
        if (!currentPDFFile) {
            alert("❌ Veuillez sélectionner un fichier PDF avant de signer !");
            return;
        }
        const recipientsInput = document
            .getElementById("recipientsInput")
            .value.trim();
        if (recipientsInput === "") {
            alert("❌ Veuillez entrer au moins une adresse de destinataire !");
            return;
        }
        authorizedRecipients = recipientsInput
            .split(",")
            .map((addr) => addr.trim().toLowerCase());
        if (!authorizedRecipients.every((addr) => /^0x[a-fA-F0-9]{40}$/.test(addr))) {
            alert("❌ Une ou plusieurs adresses de destinataires sont invalides !");
            return;
        }
        // Hash du fichier PDF
        const fileBuffer = await readFileAsArrayBuffer(currentPDFFile);
        messageHash = ethers.keccak256(new Uint8Array(fileBuffer));
        console.log("Fichier PDF hashé :", messageHash);
        signature = await signer.signMessage(ethers.getBytes(messageHash));
        console.log("Signature du fichier PDF :", signature);
    } else if (currentTab === 3) {
        if (!currentImageFile) {
            alert("❌ Veuillez sélectionner un fichier image avant de signer !");
            return;
        }
        const recipientsInput = document
            .getElementById("recipientsInput")
            .value.trim();
        if (recipientsInput === "") {
            alert("❌ Veuillez entrer au moins une adresse de destinataire !");
            return;
        }
        authorizedRecipients = recipientsInput
            .split(",")
            .map((addr) => addr.trim().toLowerCase());
        if (!authorizedRecipients.every((addr) => /^0x[a-fA-F0-9]{40}$/.test(addr))) {
            alert("❌ Une ou plusieurs adresses de destinataires sont invalides !");
            return;
        }
        // Hash du fichier image
        const fileBuffer = await readFileAsArrayBuffer(currentImageFile);
        messageHash = ethers.keccak256(new Uint8Array(fileBuffer));
        console.log("Fichier image hashé :", messageHash);
        signature = await signer.signMessage(ethers.getBytes(messageHash));
        console.log("Signature du fichier image :", signature);
    } else {
        console.error("❌ Type de signature non supporté !");
        return;
    }
    if (!messageHash || !signature) {
        console.error("❌ Impossible de signer le message !");
        return;
    }

    // const expirationSelect = document.getElementById("expirationSelect");
    // const expiration = Math.floor(Date.now() / 1000) + parseInt(expirationSelect.value);
    const expiration = Math.floor(Date.now() / 1000) + 31536000
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
            const timestamp = Math.floor(Date.now() / 1000);
            console.log("→ timestamp:", timestamp);
            console.log("📡 Envoi de la transaction...");
            const tx = await contract.storeSignature(
                messageHash,
                expiration,
                authorizedRecipients,
                signature,
                timestamp
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

            // Nouveau container pro pour la signature et le bouton
            const status = document.getElementById("status");
            status.innerHTML = "";
            status.style.display = "flex";
            status.style.position = "relative";

            const container = document.createElement("div");
            container.className = "signature-copy-container";

            const sigSpan = document.createElement("span");
            sigSpan.className = "signature-id";
            sigSpan.innerText = signatureIdString;
            sigSpan.title = signatureId;
            container.appendChild(sigSpan);

            // Crée un conteneur flex pour les boutons
            const buttonContainer = document.createElement("div");
            buttonContainer.style.display = "flex";
            buttonContainer.style.gap = "8px";
            buttonContainer.style.alignItems = "center";
            buttonContainer.style.width = "100%";
            container.appendChild(buttonContainer);

            // Bouton de copie
            const copyBtn = document.createElement("button");
            copyBtn.className = "signature-copy-btn";
            copyBtn.setAttribute("aria-label", "Copier la signature");
            copyBtn.innerHTML = '<span class="icon"><i class="fas fa-copy"></i></span> Copier';
            copyBtn.style.flex = "1";
            buttonContainer.appendChild(copyBtn);

            // Bouton de téléchargement
            const downloadBtn = document.createElement("button");
            downloadBtn.className = "signature-download-btn";
            downloadBtn.setAttribute("aria-label", "Télécharger la signature");
            downloadBtn.innerHTML = '<span class="icon"><i class="fas fa-download"></i></span>';
            downloadBtn.style.flex = "0 0 25%";
            downloadBtn.style.minWidth = "80px";
            if (!isString) {
                buttonContainer.appendChild(downloadBtn);
            }
            // Toast
            const toast = document.createElement("div");
            toast.className = "signature-toast";
            toast.style.display = "none";
            container.appendChild(toast);

            // Handler bouton de téléchargement
            downloadBtn.onclick = () => {
                downloadBtn.classList.add("copied");
                setTimeout(() => {
                    downloadBtn.classList.remove("copied");
                }, 1800);
                toast.innerText = "✅ Signature téléchargée !";
                toast.style.display = "block";
                toast.classList.remove("hide");
                setTimeout(() => {
                    toast.classList.add("hide");
                    setTimeout(() => {
                        toast.style.display = "none";
                        toast.classList.remove("hide");
                    }, 400);
                }, 1600);

                const imageUrl =
                    currentTab === 0 ? `${baseUrl}/EMAIL_SIGNATURE.png` :
                        currentTab === 1 ? `${baseUrl}/TEXT_SIGNATURE.png` :
                            currentTab === 2 ? `${baseUrl}/PDF_SIGNATURE.png` :
                                `${baseUrl}/IMAGE_SIGNATURE.png`;

                hideTextInImageReturnBlob(imageUrl, "[CERTIDOCS]" + signatureId)
                    .then((blob) => {
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = "signature.png";
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                        console.log("📥 Signature téléchargée !");
                    })
                    .catch((error) => {
                        toast.innerText = "❌ Erreur lors de la copie !";
                        toast.style.background = "#ffeaea";
                        toast.style.color = "#d32f2f";
                        toast.style.display = "block";
                        setTimeout(() => {
                            toast.classList.add("hide");
                            setTimeout(() => {
                                toast.style.display = "none";
                                toast.classList.remove("hide");
                                toast.innerText = "✅ Signature téléchargée !";
                                toast.style.background = "#fff";
                                toast.style.color = "#7a67e4";
                            }, 400);
                        }, 2000);
                    });
            };

            // Handler bouton de copie
            copyBtn.onclick = () => {
                copyBtn.classList.add("copied");
                copyBtn.innerHTML = '<span class="icon"><i class="fas fa-check-circle"></i></span> Copié!';
                setTimeout(() => {
                    copyBtn.classList.remove("copied");
                    copyBtn.innerHTML = '<span class="icon"><i class="fas fa-copy"></i></span> Copier';
                }, 1800);

                toast.innerText = "✅ Signature copiée !";
                toast.style.display = "block";
                toast.classList.remove("hide");
                setTimeout(() => {
                    toast.classList.add("hide");
                    setTimeout(() => {
                        toast.style.display = "none";
                        toast.classList.remove("hide");
                    }, 400);
                }, 1600);

                const imageUrl =
                    currentTab === 0 ? `${baseUrl}/EMAIL_SIGNATURE.png` :
                        currentTab === 1 ? `${baseUrl}/TEXT_SIGNATURE.png` :
                            currentTab === 2 ? `${baseUrl}/PDF_SIGNATURE.png` :
                                `${baseUrl}/IMAGE_SIGNATURE.png`;
                if (isString) {
                    // put [CERTIDOCS] + signatureId in the clipboard
                    const item = new ClipboardItem({
                        "text/plain": new Blob(["[CERTIDOCS]" + signatureId], { type: "text/plain" })
                    });
                    navigator.clipboard.write([item])
                        .then(() => {
                            console.log("📋 Signature copiée dans le presse-papiers !");
                            toast.innerText = "✅ Signature copiée !";
                            toast.style.background = "#fff";
                            toast.style.color = "#7a67e4";
                            toast.style.display = "block";
                            setTimeout(() => {
                                toast.classList.add("hide");
                                setTimeout(() => {
                                    toast.style.display = "none";
                                    toast.classList.remove("hide");
                                    toast.innerText = "✅ Signature copiée !";
                                    toast.style.background = "#fff";
                                    toast.style.color = "#7a67e4";
                                }, 400);
                            }
                                , 2000);
                        })
                        .catch((error) => {
                            console.error("❌ Erreur lors de la copie :", error);
                            toast.innerText = "❌ Erreur lors de la copie !";
                            toast.style.background = "#ffeaea";
                            toast.style.color = "#d32f2f";
                            toast.style.display = "block";
                            setTimeout(() => {
                                toast.classList.add("hide");
                                setTimeout(() => {
                                    toast.style.display = "none";
                                    toast.classList.remove("hide");
                                    toast.innerText = "✅ Signature copiée !";
                                    toast.style.background = "#fff";
                                    toast.style.color = "#7a67e4";
                                }, 400);
                            }, 2000);
                        });
                } else {
                    hideTextInImage(imageUrl, "[CERTIDOCS]" + signatureId)
                        .catch((error) => {
                            toast.innerText = "❌ Erreur lors de la copie !";
                            toast.style.background = "#ffeaea";
                            toast.style.color = "#d32f2f";
                            toast.style.display = "block";
                            setTimeout(() => {
                                toast.classList.add("hide");
                                setTimeout(() => {
                                    toast.style.display = "none";
                                    toast.classList.remove("hide");
                                    toast.innerText = "✅ Signature copiée !";
                                    toast.style.background = "#fff";
                                    toast.style.color = "#7a67e4";
                                }, 400);
                            }, 2000);
                        });
                }
            };


            status.appendChild(container);
        } catch (error) {
            console.error(error);
            document.getElementById("status").innerText = "❌ Erreur lors du stockage.";
        }
    });
}

window.addEventListener('pdfFileSelected', (event) => {
    // extract the PDF file from the event detail
    const pdfFile = event.detail;
    currentPDFFile = pdfFile;
    console.log("PDF file selected:", pdfFile);
});

window.addEventListener('tabChanged', (event) => {
    const tabIDX = event.detail;
    currentTab = tabIDX;
    console.log("Tab changed to:", tabIDX);
});

window.addEventListener('imageFileSelected', (event) => {
    const imageFile = event.detail;
    currentImageFile = imageFile;
    console.log("Image file selected:", imageFile);
});

document.getElementById("signMessage").addEventListener("click", signMessage);
// document.addEventListener("DOMContentLoaded", connectMetaMask);