// src/config/reownConfig.js
import {
  createAppKit,
} from "@reown/appkit/react";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { arbitrum, mainnet, sepolia } from "@reown/appkit/networks";

const projectId = "1019020ae365b863749f171de78f514a";

const metadata = {
  name: "Certidoc",
  description: "AppKit Example",
  url: window.location.origin,
  icons: ["https://assets.reown.com/reown-profile-pic.png"],
};

const networks = [mainnet, arbitrum, sepolia];

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
