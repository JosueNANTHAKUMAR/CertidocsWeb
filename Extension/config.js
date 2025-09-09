// Configuration pour les environnements de développement et de production
const CONFIG = {
    // Basculer manuellement entre dev (true) et prod (false)
    isDevelopment: true,

    // URLs de développement
    dev: {
        baseUrl: "http://localhost:3000",
        generateUrl: "http://localhost:3000/",
        verifyUrl: "http://localhost:3000/verify"
    },

    // URLs de production
    prod: {
        baseUrl: "https://certidocsweb-yf6fjg.dappling.network",
        generateUrl: "https://certidocsweb-yf6fjg.dappling.network/",
        verifyUrl: "https://certidocsweb-yf6fjg.dappling.network/verify"
    }
};

function getActiveConfig() {
    return CONFIG.isDevelopment ? CONFIG.dev : CONFIG.prod;
}

function getGenerateUrl(messageHash) {
    const cfg = getActiveConfig();
    if (messageHash) {
        return `${cfg.generateUrl}?messageHash=${messageHash}`;
    }
    return cfg.generateUrl;
}

function getVerifyUrl(messageHash, signatureId) {
    const cfg = getActiveConfig();
    let url = cfg.verifyUrl;
    const params = [];
    if (messageHash) params.push(`messageHash=${messageHash}`);
    if (signatureId) params.push(`signatureId=${signatureId}`);
    if (params.length > 0) url += `?${params.join("&")}`;
    return url;
}


