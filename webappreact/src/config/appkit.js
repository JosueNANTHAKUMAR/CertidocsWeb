// src/config/reownConfig.js
import {
    createAppKit,
} from "@reown/appkit/react";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import {
    mainnet,
    arbitrum,
    sepolia,
    polygon,
    optimism,
    bsc,
    avalanche,
    fantom,
    gnosis,
    base,
} from "@reown/appkit/networks";

const polygonAmoy = {
    id: 80002,
    name: 'Polygon Amoy',
    nativeCurrency: {
        name: 'MATIC',
        symbol: 'MATIC',
        decimals: 18,
    },
    rpcUrls: {
        default: {
            http: [process.env.REACT_APP_ALCHEMY_API_KEY || "https://rpc.amoy.polygonscan.com"],
        },
    },
    blockExplorers: {
        default: {
            name: 'AmoyScan',
            url: 'https://amoy.polygonscan.com',
        },
    },
    testnet: true,
}

const projectId = process.env.REACT_APP_REOWN_PROJECT_ID || "";

const metadata = {
    name: "Certidoc",
    description: "AppKit Example",
    url: window.location.origin,
    icons: ["https://assets.reown.com/reown-profile-pic.png"],
};

// Liste élargie des réseaux pris en charge
const networks = [
    mainnet,
    arbitrum,
    sepolia,
    polygon,
    optimism,
    bsc,
    avalanche,
    fantom,
    gnosis,
    base,
    polygonAmoy, // Ajout du réseau Polygon Amoy
];

const wagmiAdapter = new WagmiAdapter({
    networks,
    projectId,
    ssr: true,
});

createAppKit({
    enableEmail: true, // Activation de l'email
    adapters: [wagmiAdapter],
    socials: [],
    networks,
    projectId,
    metadata,
    defaultNetwork: polygon, // Utilisation du réseau Polygon Amoy par défaut
    features: {
        analytics: true,
        connectMethodsOrder: ['wallet', 'email'],
    },
});

// On exporte seulement wagmiAdapter (c’est tout ce qu’il te faut dans App.js)
export { wagmiAdapter };
