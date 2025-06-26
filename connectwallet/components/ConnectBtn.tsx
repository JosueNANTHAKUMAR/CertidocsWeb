"use client"

import { useAccount, useConnectorClient } from "wagmi"
import { useEffect, useMemo } from "react"
import { BrowserProvider } from "ethers"

export default function ConnectBtn() {
  const { address, isConnected } = useAccount()
  const { data: client } = useConnectorClient()

  // Ouvre automatiquement la modal de connexion
  useEffect(() => {
    if (!isConnected && typeof window !== "undefined") {
      const timeout = setTimeout(() => {
        const openModal = (window as any).openWeb3Modal
        if (typeof openModal === "function") {
          openModal()
        } else {
          const btn = document.querySelector('w3m-button')
          if (btn) (btn as HTMLElement).click()
        }
      }, 300)
      return () => clearTimeout(timeout)
    }
  }, [isConnected])

  // Prépare le signer
  const signer = useMemo(() => {
    if (!client) return undefined
    const network = {
      chainId: client.chain.id,
      name: client.chain.name,
      ensAddress: client.chain.contracts?.ensRegistry?.address,
    }
    const provider = new BrowserProvider(client.transport, network)
    return provider.getSigner(client.account.address)
  }, [client])

  // Envoie l'adresse à la page parent + ferme le popup
  useEffect(() => {
    if (isConnected && address && signer) {
      ;(async () => {
        const resolvedSigner = await signer
        const signerAddress = await resolvedSigner.getAddress()

        console.log("Wallet connecté :", signerAddress)
        window.opener?.postMessage(
          {
            type: "wallet_connected",
            address: signerAddress,
            chainId: client?.chain.id,
          },
          "*"
        )

        // ✅ Ferme automatiquement la popup
        setTimeout(() => {
          window.close()
        }, 500) // léger délai pour que le message soit bien reçu
      })()
    }
  }, [isConnected, address, signer])

  return <w3m-button />
}
