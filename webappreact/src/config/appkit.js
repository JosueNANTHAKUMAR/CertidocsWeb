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

const projectId = process.env.REACT_APP_REOWN_PROJECT_ID;

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
];

const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
  ssr: true,
});

createAppKit({
  enableEmail: false,
  adapters: [wagmiAdapter],
  socials: [],
  networks,
  projectId,
  metadata,
  features: {
    analytics: true,
    connectMethodsOrder: ['wallet'],
  },
});

// On exporte seulement wagmiAdapter (c’est tout ce qu’il te faut dans App.js)
export { wagmiAdapter };
