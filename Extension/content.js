chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "getDivContentGenerate") {

        function tryGetContent() {
            // Gmail
            const gmailDivs = document.querySelectorAll("div.Am.aiL.Al.editable.LW-avf.tS-tW");
            if (gmailDivs.length) {
                sendResponse({ content: gmailDivs[gmailDivs.length - 1].innerText });
                console.log("✅ Gmail trouvé !");
                return true;
            }

            // Outlook
            const outlookDivs = document.querySelectorAll('div[contenteditable="true"][role="textbox"]');
            for (const el of outlookDivs) {
                if ((el.getAttribute('aria-label') || "").includes('Corps du message')) {
                    sendResponse({ content: el.innerText });
                    console.log("✅ Outlook trouvé !");
                    return true;
                }
            }

            return false;
        }

        if (tryGetContent()) return true;
        // Vérifie en boucle les doms balises (Outlook)
        const observer = new MutationObserver(() => {
            if (tryGetContent()) observer.disconnect();
        });

        observer.observe(document.body, { childList: true, subtree: true });
        return true;
    }
});

async function extractTextFromImage(imageUrl) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
            const canvas = Object.assign(document.createElement("canvas"), { width: img.width, height: img.height });
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0);
            const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

            let binaryText = "";
            for (let i = 0; i < data.length; i += 4) {
                binaryText += (data[i] & 1).toString();
                if (binaryText.endsWith("00000000")) break;
            }
            resolve(binaryText.match(/.{8}/g).map(b => String.fromCharCode(parseInt(b, 2))).join('').replace(/\x00+$/, ''));
        };
        img.onerror = () => reject("Erreur de chargement de l'image");
        img.src = imageUrl;
    });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "getDivContentVerify") {
        console.log("[getDivContentVerify] Début récupération...");

        try {
            let content = "", src = "";

            const gmailDiv = document.querySelector("div.ii.gt");
            if (gmailDiv) {
                content = gmailDiv.innerText || "";
                const img = gmailDiv.querySelector("img");
                if (img) src = img.getAttribute("src") || "";
            }

            if (!content) {
                const rpsDiv = document.querySelector('div[class^="rps_"]');
                if (rpsDiv) {
                    for (const el of rpsDiv.querySelectorAll('div.x_elementToProof')) {
                        const img = el.querySelector('img');
                        if (img) { src = img.getAttribute('src') || ""; break; }
                        if (el.innerText.trim()) content += el.innerText.trim() + "\n";
                    }
                    content = content.trim();
                }
            }

            if (!content && !src) {
                const img = document.querySelector('img.Do8Zj');
                if (img) {
                    src = img.getAttribute("src") || "";
                    const parent = img.closest('div[class^="rps_"], div[role="document"], div.x_WordSection1');
                    if (parent) content = parent.innerText.trim();
                }
            }

            if (!content) {
                console.warn("[getDivContentVerify] Aucun contenu trouvé.");
                sendResponse({ content: "Aucune div trouvée", signatureId: "" });
                return;
            }

            console.log("[getDivContentVerify] Contenu récupéré :", content);

            content = content.replace(/Télécharger\nAjouter à Drive\nEnregistrer dans Photos\n?/g, "")
                             .replace(/Analyse antivirus en cours...\nAjouter à Drive\nEnregistrer dans Photos\n?/g, "");

            if (src) {
                extractTextFromImage(src).then(text => {
                    console.log("✅ Signature extraite :", text);
                    sendResponse({ content: content, signatureId: text });
                }).catch(() => {
                    console.error("[getDivContentVerify] Erreur extraction image");
                    sendResponse({ content: content, signatureId: "" });
                });
            } else {
                console.warn("[getDivContentVerify] Pas d'image trouvée.");
                sendResponse({ content: content, signatureId: "" });
            }

            return true;
        } catch (e) {
            console.error("[getDivContentVerify] Exception :", e);
            sendResponse({ content: "Erreur récupération", signatureId: "" });
        }
    }
});

function replaceCertidocsInTextNodes(node) {
    if (node.nodeType === Node.TEXT_NODE) {
        const text = node.nodeValue;
        if (!text.includes("[CERTIDOCS]")) return;
        const grandParent = node.parentNode?.parentNode;
        const isGmail = grandParent?.classList.contains("Am") && grandParent.classList.contains("aiL");
        const isOutlook = grandParent?.getAttribute("role") === "textbox";
        if (!isGmail && !isOutlook) return;

        const span = document.createElement("span");
        span.innerHTML = text.replace(/\[CERTIDOCS\]/g, "[SIGNATURE]");
        node.parentNode.replaceChild(span, node);
        console.log("🔄 [replaceCertidocs] Remplacement effectué !");
    } else {
        node.childNodes.forEach(replaceCertidocsInTextNodes);
    }
}

function replaceCertidocs() {
    replaceCertidocsInTextNodes(document.body);
}

const observer = new MutationObserver(() => replaceCertidocs());
observer.observe(document.body, { childList: true, subtree: true });
window.addEventListener("load", replaceCertidocs);