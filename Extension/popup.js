document.getElementById("generate").addEventListener("click", () => {
    chrome.runtime.sendMessage({ action: "openSignatureWindow" });
});

document.getElementById("verify").addEventListener("click", () => {
    chrome.runtime.sendMessage({ action: "openVerificationWindow" });
});
