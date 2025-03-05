chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "getDivContentGenerate") {

        // recupere la deuxieme div avec la classe 'Am aiL Al editable LW-avf tS-tW' et recupere son contenu
        try {
            const divs = document.querySelectorAll("div.Am.aiL.Al.editable.LW-avf.tS-tW");
            // recupere le contenu de la derniere div
            const content = divs[divs.length - 1].innerText;
            console.log("Contenu de la div:", content);
            sendResponse({ content: content });
        } catch (error) {
            sendResponse({ content: "Aucune div trouvée" });
        }
    }
});

async function extractTextFromImage(imageUrl) {
    const img = new Image();
    img.crossOrigin = "anonymous";
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

            let binaryText = "";
            for (let i = 0; i < data.length; i += 4) {
                binaryText += (data[i] & 1).toString();
                if (binaryText.endsWith("00000000")) break;
            }

            const chars = binaryText.match(/.{8}/g).map(byte => String.fromCharCode(parseInt(byte, 2)));
            resolve(chars.join('').replace(/\x00+$/, ''));
        };
        
        img.onerror = () => reject("Erreur de chargement de l'image");
    });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "getDivContentVerify") {
        // recupere la premiere div avec la classe 'ii gt' et recupere son contenu
        try {
            const divs = document.querySelectorAll("div.ii.gt");
            // recupere le contenu de la premiere div
            let content = divs[0].innerText;
            // remove "Télécharger\nAjouter à Drive\nEnregistrer dans Photos" from the content
            content = content.replace("Télécharger\nAjouter à Drive\nEnregistrer dans Photos\n", "");
            content = content.replace("Télécharger\nAjouter à Drive\nEnregistrer dans Photos", "");
            content = content.replace("Analyse antivirus en cours...\nAjouter à Drive\nEnregistrer dans Photos\n", "");
            content = content.replace("Analyse antivirus en cours...\nAjouter à Drive\nEnregistrer dans Photos", "");
            // get image in the div
            const images = divs[0].querySelectorAll("img");
            // get the image src attribute
            const src = images[0].getAttribute("src");
            
            extractTextFromImage(src).then(text => {
                console.log("Texte extrait de l'image:", text);
                console.log("Contenu de la div:", content);
                // now inside the div, from '[CERTIDOCS]' to the end of the string replace every thing by an image
                sendResponse({ content: content, signatureId: text});
                console.log("Contenu de la div:", content);
            }).catch(error => {
                console.error(error);
                sendResponse({ content: "Erreur lors de l'extraction du texte de l'image", signatureId: "" });
            });
            return true;
        } catch (error) {
            sendResponse({ content: "Aucune div trouvée", signatureId: "" });
        }
    }
});

function replaceCertidocsInTextNodes(node) {
    if (node.nodeType === Node.TEXT_NODE) {
        let text = node.nodeValue;
        if (text.includes("[CERTIDOCS]")) {
            // get the parent node
            const parent = node.parentNode;
            // get the parent of the parent node
            const grandParent = parent.parentNode;
            // check if grandParent is a div with the class 'Am aiL Al editable LW-avf tS-tW'
            console.log(grandParent.classList);
            if (grandParent.classList.contains("Am") && grandParent.classList.contains("aiL") && grandParent.classList.contains("Al") && grandParent.classList.contains("editable") && grandParent.classList.contains("LW-avf") && grandParent.classList.contains("tS-tW")) {
                return;
            }

            let span = document.createElement("span");
            span.innerHTML = text.replace(/\[CERTIDOCS\]/g, "[SIGNATURE]");
            // span.innerHTML = "JOSUE"
            // span.innerHTML = text.replace(/\[CERTIDOCS\]/g, `<img src="https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.flaticon.com%2Ffree-icon%2Funlock_9970524&psig=AOvVaw3qGnOZf7FotPVMwXcLtOq1&ust=1739456516209000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCLjEydCqvosDFQAAAAAdAAAAABBR" alt="🔒" style="width: 16px; height: 16px; vertical-align: middle;">`);
            // Remplacer uniquement le nœud texte par le <span>
            node.parentNode.replaceChild(span, node);
        }
    } else {
        // Parcourir récursivement les enfants du nœud
        node.childNodes.forEach(replaceCertidocsInTextNodes);
    }
}

function replaceCertidocs() {
    replaceCertidocsInTextNodes(document.body);
}

// Observer les changements du DOM
const observer = new MutationObserver(() => {
    replaceCertidocs();
});

// Lancer l'observation du body
observer.observe(document.body, { childList: true, subtree: true });

// Exécuter une première fois au chargement
window.addEventListener("load", replaceCertidocs);