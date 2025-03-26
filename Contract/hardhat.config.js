require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
    solidity: "0.8.19",
    networks: {
        amoy: {
            url: process.env.ALCHEMY_AMOY_RPC, // ou autre RPC Polygon AMOY (Infura, Alchemy, Polygon RPC officiel)
            accounts: [process.env.PRIVATE_KEY],
            chainId: 80002
        }
    }
};