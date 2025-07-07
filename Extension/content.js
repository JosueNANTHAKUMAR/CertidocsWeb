chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "getDivContentGenerate") {
        let resolved = false;

        // ✅ GMAIL
        try {
            const divs = document.querySelectorAll("div.Am.aiL.Al.editable.LW-avf.tS-tW");
            if (divs.length) {
                const content = normalizeMessage(divs[divs.length - 1].innerText);
                console.log("✅ Gmail trouvé !");
                sendResponse({ content: content });
                resolved = true;
                return true;
            }
        } catch (error) {
            console.warn("❌ Gmail div introuvable");
        }

        // ✅ OUTLOOK
        function tryGetOutlookContent() {
            if (resolved) return true; // on a déjà répondu (évite double réponse)

            const outlookDivs = document.querySelectorAll('div[contenteditable="true"][role="textbox"]');
            for (const el of outlookDivs) {
                const aria = el.getAttribute("aria-label") || "";
                if (
                    aria.toLowerCase().includes("corps du message") ||
                    aria.toLowerCase().includes("message body")
                ) {
                    let content = normalizeMessage(el.innerText || "");

                    console.log("✅ Outlook trouvé !");
                    sendResponse({ content: content });
                    resolved = true;
                    return true;
                }
            }
            return false;
        }

        if (tryGetOutlookContent()) return true;

        // ⏳ Attente DOM Outlook
        const observer = new MutationObserver(() => {
            if (tryGetOutlookContent()) observer.disconnect();
        });
        observer.observe(document.body, { childList: true, subtree: true });
        sendResponse({ content: "Aucune div trouvée" });
        return true;
    }
});

function normalizeMessage(content) {
    return content
        .replace(/\r\n/g, "\n")            // CRLF to LF
        .replace(/\n{2,}/g, "\n")          // multiple line breaks → single
        .replace(/[ \t]{2,}/g, " ")        // multiple spaces → one
        .replace(/\u200B/g, "")            // zero-width space
        .replace(/\u00A0/g, " ")           // non-breaking space
        .replace(/\s+$/, "")               // trailing whitespace
        .replace(/^\s+/, "")               // leading whitespace
        .normalize("NFC");
}

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
        console.log("[getDivContentVerify] Début récupération...");

        try {
            let content = "", src = "";

            const gmailDiv = document.querySelector("div.ii.gt");
            if (gmailDiv) {
                // On filtre sur le premier <div dir="ltr"> à l'intérieur de gmailDiv
                const mainDiv = gmailDiv.querySelector('div[dir="ltr"]');
                if (mainDiv) {
                    content = mainDiv.innerText || "";
                    const img = mainDiv.querySelector("img");
                    if (img) src = img.getAttribute("src") || "";
                } else {
                    content = gmailDiv.innerText || "";
                    const img = gmailDiv.querySelector("img");
                    if (img) src = img.getAttribute("src") || "";
                }
            }

            if (!content) {
                const rpsDiv = document.querySelector('div[class^="rps_"]');
                if (rpsDiv) {
                    for (const el of rpsDiv.querySelectorAll('x_elementToProof')) {
                        const img = el.querySelector('img');
                        if (img) { src = img.getAttribute('src') || ""; break; }
                        if (el.innerText.trim()) content += el.innerText.trim() + "\n";
                    }
                    content = content.trim();
                    content = normalizeMessage(content);
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
            // check if content includes "Vous n’obtenez pas souvent d’e-mail à partir de chamajegogame@gmail.com. Pourquoi c’est important" with chamajecogame@gmail.com a variable
            if (content.includes("Vous n’obtenez pas souvent d’e-mail à partir de") && content.includes("@")) {
                const index = content.indexOf("\n");
                if (index !== -1) {
                    content = content.substring(index + 1).trim();
                }
                console.log(content);
            }
            console.log("[getDivContentVerify] Contenu récupéré :", content);

            content = content.replace(/Télécharger\nAjouter à Drive\nEnregistrer dans Photos\n?/g, "")
                .replace(/Analyse antivirus en cours...\nAjouter à Drive\nEnregistrer dans Photos\n?/g, "");

            if (src) {
                extractTextFromImage(src).then(text => {
                    console.log("✅ Signature extraite :", text);
                    content = normalizeMessage(content);
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