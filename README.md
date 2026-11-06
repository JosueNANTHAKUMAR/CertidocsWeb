# CertidocsWeb

Application web de certification de documents sur la blockchain. Elle permet de signer un message, un texte, un PDF ou une image avec son wallet, d'enregistrer la preuve dans un smart contract, puis de vérifier cette preuve plus tard.

## Fonctionnalités

- **Connexion** par wallet ou par e-mail, via Reown AppKit
- **Signature** de quatre types de contenu : mail, texte, PDF et image
- **Empreinte keccak256** du contenu, signée par le wallet
- **Enregistrement on-chain** de la signature, avec les adresses des destinataires autorisés et une date d'expiration (un an)
- **Vérification** d'une signature à partir de son identifiant et du contenu d'origine, sur la page `/verify`
- **Texte dissimulé dans une image**, écrit à la signature puis relu à la vérification

## Stack technique

| Domaine | Technologies |
| --- | --- |
| Interface | React 19, Create React App, React Router 7, React Icons |
| Web3 | Reown AppKit, wagmi, viem, ethers 6 |
| Données | TanStack Query |
| Déploiement | dAppling |

Le code du smart contract n'est pas dans ce dépôt : l'application appelle un contrat déjà déployé.

## Prérequis

- Node.js 18 (version indiquée dans `.nvmrc`)
- npm 8 ou plus récent
- Un wallet compatible, par exemple MetaMask
- Un identifiant de projet [Reown](https://cloud.reown.com)

## Installation

```bash
git clone https://github.com/JosueNANTHAKUMAR/CertidocsWeb.git
cd CertidocsWeb/webappreact
npm install
```

Créez ensuite un fichier `webappreact/.env.local`, à ne pas committer :

```env
REACT_APP_REOWN_PROJECT_ID=votre_identifiant_reown
# Optionnel : URL complète du RPC pour Polygon Amoy
REACT_APP_ALCHEMY_API_KEY=votre_url_rpc
```

## Lancement

```bash
npm start
```

L'application est disponible sur http://localhost:3000 :

- `/` pour signer un contenu
- `/verify` pour vérifier une signature

Pour générer la version de production :

```bash
npm run build
```

## Captures à ajouter

Placez les images dans `docs/screenshots/`, puis ajoutez-les ici :

- [ ] Page de signature avec le wallet connecté
- [ ] Onglets mail, texte, PDF et image
- [ ] Signature confirmée, avec son identifiant
- [ ] Page de vérification et résultat
