// Configuration Web3 pour dAppling
export const web3Config = {
  // Configuration réseau principal
  mainnet: {
    chainId: 1,
    name: 'Ethereum Mainnet',
    rpcUrl: process.env.REACT_APP_RPC_URL || 'https://mainnet.infura.io/v3/YOUR_PROJECT_ID',
    explorerUrl: 'https://etherscan.io',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18
    }
  },
  
  // Configuration testnet (pour développement)
  testnet: {
    chainId: 5, // Goerli
    name: 'Goerli Testnet',
    rpcUrl: process.env.REACT_APP_TESTNET_RPC_URL || 'https://goerli.infura.io/v3/YOUR_PROJECT_ID',
    explorerUrl: 'https://goerli.etherscan.io',
    nativeCurrency: {
      name: 'Goerli Ether',
      symbol: 'ETH',
      decimals: 18
    }
  },
  
  // Configuration WalletConnect
  walletConnect: {
    projectId: process.env.REACT_APP_WALLET_CONNECT_PROJECT_ID || 'YOUR_PROJECT_ID',
    metadata: {
      name: 'CertidocsWeb',
      description: 'Application de certification décentralisée',
      url: window.location.origin,
      icons: [`${window.location.origin}/logo192.png`]
    }
  },
  
  // Configuration ENS
  ens: {
    registryAddress: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e',
    supported: true
  },
  
  // Configuration dAppling
  dappling: {
    enabled: process.env.REACT_APP_DAPPLING_DEPLOYMENT === 'true',
    deploymentUrl: process.env.REACT_APP_DEPLOYMENT_URL || null
  }
};

// Fonction pour obtenir la configuration selon l'environnement
export const getWeb3Config = (network = 'mainnet') => {
  return web3Config[network] || web3Config.mainnet;
};

// Fonction pour vérifier si dAppling est activé
export const isDapplingEnabled = () => {
  return web3Config.dappling.enabled;
};

export default web3Config;
