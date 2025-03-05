const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SignatureRegistry", function () {
    let SignatureRegistry, contract, owner, recipient, fakeRecipient;

    before(async function () {
        [owner, recipient] = await ethers.getSigners();
        fakeRecipient = await ethers.Wallet.createRandom();
        SignatureRegistry = await ethers.getContractFactory("SignatureRegistry");
        contract = await SignatureRegistry.deploy();
        await contract.waitForDeployment();
    });

    it("Devrait stocker et vérifier une signature", async function () {
        const message = "Document signé";
        const messageHash = ethers.keccak256(ethers.toUtf8Bytes(message));
        // ⚠️ Utiliser `hashMessage()` pour qu'Ethers.js signe comme Solidity attend
        const ethSignedMessageHash = ethers.hashMessage(ethers.getBytes(messageHash));

        const signature = await owner.signMessage(ethers.getBytes(messageHash));

        const latestBlock = await ethers.provider.getBlock("latest");
        const expiration = latestBlock.timestamp + 3600;
        const authorizedRecipients = [recipient.address];

        // console.log("📌 Message Hash:", messageHash);
        // console.log("📌 Ethereum Signed Hash (Ethers.js) :", ethSignedMessageHash);
        // console.log("📌 Signature:", signature);
        // console.log("📌 Owner Address:", owner.address);
        // console.log("📌 Recipient Address:", recipient.address);

        // Stocker la signature et récupérer `signatureId` depuis l'événement
        const tx = await contract.storeSignature(messageHash, expiration, authorizedRecipients, signature);
        const receipt = await tx.wait();
        const event = receipt.logs.find(log => log.fragment.name === "SignatureStored");

        const signatureId = event.args.signatureId;
        // console.log("📌 Signature ID enregistrée :", signatureId);

        // Vérifier la signature
        const [isValid, signerStored, recoveredSigner, messageHashStored, messageHashProvided] = 
            await contract.verifySignature(signatureId, recipient.address, messageHash);

        console.log("📌 Debug (Stockage) Vérification :");
        console.log("    - Signature ID vérifié :", signatureId);
        console.log("    - Message Hash Stocké :", messageHashStored);
        console.log("    - Message Hash Fourni :", messageHashProvided);
        console.log("    - Adresse signataire stockée :", signerStored);
        console.log("    - Adresse récupérée par `ecrecover()` :", recoveredSigner);
        console.log("    - Recipient Address:", recipient.address);
        console.log("    - Est-ce valide ?", isValid);

        expect(isValid).to.equal(true);
    });

    it("Devrait rejeter un destinataire non autorisé", async function () {
        const message = "Document signé";
        const messageHash = ethers.keccak256(ethers.toUtf8Bytes(message));
        const ethSignedMessageHash = ethers.hashMessage(ethers.getBytes(messageHash));

        const signature = await owner.signMessage(ethers.getBytes(messageHash));

        const latestBlock = await ethers.provider.getBlock("latest");
        const expiration = latestBlock.timestamp + 3600;
        const authorizedRecipients = [recipient.address];

        const tx = await contract.storeSignature(messageHash, expiration, authorizedRecipients, signature);
        const receipt = await tx.wait();
        const event = receipt.logs.find(log => log.fragment.name === "SignatureStored");

        const signatureId = event.args.signatureId;

        const [isValid, signerStored, recoveredSigner, messageHashStored, messageHashProvided] = 
            await contract.verifySignature(signatureId, fakeRecipient.address, messageHash);

        console.log("📌 Debug (Unauthorized) Vérification :");
        console.log("    - Signature ID vérifié :", signatureId);
        console.log("    - Message Hash Stocké :", messageHashStored);
        console.log("    - Message Hash Fourni :", messageHashProvided);
        console.log("    - Adresse signataire stockée :", signerStored);
        console.log("    - Adresse récupérée par `ecrecover()` :", recoveredSigner);
        console.log("    - Recipient Address:", fakeRecipient.address);
        console.log("    - Est-ce valide ?", isValid);

        expect(isValid).to.equal(false);
    });

    it("Devrait rejeter une signature expirée", async function () {
        const message = "Document signé";
        const messageHash = ethers.keccak256(ethers.toUtf8Bytes(message));
        const ethSignedMessageHash = ethers.hashMessage(ethers.getBytes(messageHash));

        const signature = await owner.signMessage(ethers.getBytes(messageHash));

        const latestBlock = await ethers.provider.getBlock("latest");
        const expiration = latestBlock.timestamp - 1;
        const authorizedRecipients = [recipient.address];

        const tx = await contract.storeSignature(messageHash, expiration, authorizedRecipients, signature);
        const receipt = await tx.wait();
        const event = receipt.logs.find(log => log.fragment.name === "SignatureStored");

        const signatureId = event.args.signatureId;

        const [isValid, signerStored, recoveredSigner, messageHashStored, messageHashProvided] = 
            await contract.verifySignature(signatureId, recipient.address, messageHash);

        console.log("📌 Debug (Expired) Vérification :");
        console.log("    - Signature ID vérifié :", signatureId);
        console.log("    - Message Hash Stocké :", messageHashStored);
        console.log("    - Message Hash Fourni :", messageHashProvided);
        console.log("    - Adresse signataire stockée :", signerStored);
        console.log("    - Adresse récupérée par `ecrecover()` :", recoveredSigner);
        console.log("    - Recipient Address:", recipient.address);
        console.log("    - Est-ce valide ?", isValid);

        expect(isValid).to.equal(false);
    });

    it("Devrait rejeter une signature invalide", async function () {
        const message = "Document signé";
        const messageHash = ethers.keccak256(ethers.toUtf8Bytes(message));
        const ethSignedMessageHash = ethers.hashMessage(ethers.getBytes(messageHash));

        const signature = await owner.signMessage(ethers.getBytes(messageHash));

        const latestBlock = await ethers.provider.getBlock("latest");
        const expiration = latestBlock.timestamp + 3600;
        const authorizedRecipients = [recipient.address];

        const tx = await contract.storeSignature(messageHash, expiration, authorizedRecipients, signature);
        const receipt = await tx.wait();
        const event = receipt.logs.find(log => log.fragment.name === "SignatureStored");

        const signatureId = event.args.signatureId;

        const [isValid, signerStored, recoveredSigner, messageHashStored, messageHashProvided] = 
            await contract.verifySignature(signatureId, recipient.address, ethers.keccak256(ethers.toUtf8Bytes("Fake message")));

        console.log("📌 Debug (Bad message) Vérification :");
        console.log("    - Signature ID vérifié :", signatureId);
        console.log("    - Message Hash Stocké :", messageHashStored);
        console.log("    - Message Hash Fourni :", messageHashProvided);
        console.log("    - Adresse signataire stockée :", signerStored);
        console.log("    - Adresse récupérée par `ecrecover()` :", recoveredSigner);
        console.log("    - Recipient Address:", recipient.address);
        console.log("    - Est-ce valide ?", isValid);

        expect(isValid).to.equal(false);
    });
    
});
