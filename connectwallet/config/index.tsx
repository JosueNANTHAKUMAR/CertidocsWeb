// config/index.tsx

import { cookieStorage, createStorage, http } from '@wagmi/core'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { base, baseSepolia, mainnet, arbitrum, sepolia } from '@reown/appkit/networks'

// Get projectId from https://cloud.reown.com
export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;

if (!projectId) {
  throw new Error('Project ID is not defined')
}

// Ajout de sepolia (Ethereum testnet)
export const networks = [base, baseSepolia, mainnet, arbitrum, sepolia]

// Set up the Wagmi Adapter (Config)
export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage
  }),
  ssr: true,
  projectId,
  networks
})

export const config = wagmiAdapter.wagmiConfig
