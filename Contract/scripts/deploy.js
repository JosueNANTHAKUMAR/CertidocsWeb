const hre = require("hardhat");

async function main() {
    const SignatureRegistry = await hre.ethers.getContractFactory("SignatureRegistry");
    const contract = await SignatureRegistry.deploy();

    await contract.waitForDeployment(); // Correction pour Ethers v6

    const contractAddress = await contract.getAddress(); // Vérifie bien que cette ligne fonctionne
    console.log("Smart Contract déployé à l'adresse :", contractAddress);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });