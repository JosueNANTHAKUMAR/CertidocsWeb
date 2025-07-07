require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
    solidity: "0.8.19",
    networks: {
        polygon: {
            url: process.env.ALCHEMY_POLYGON_RPC, // ou autre RPC Polygon AMOY (Infura, Alchemy, Polygon RPC officiel)
            accounts: [process.env.PRIVATE_KEY],
            chainId: 137
        }
    }
};