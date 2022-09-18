require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require("hardhat-deploy");
require("solidity-coverage");
require("hardhat-gas-reporter");
require("hardhat-contract-sizer");
require("dotenv").config()

const MAINNET_RPC_URL = process.env.MAINNET_RPC_URL

module.exports = {
    defaultNetwork: "hardhat",
    networks: {
        hardhat: {
            forking: {
            url: MAINNET_RPC_URL
            }
        }
    },
    solidity: {
        compilers: [
             { version: "0.8.7"}
            ,{ version: "0.6.12"}
            ,{ version: "0.6.6"}
            ,{ version: "0.6.0"}
            ,{ version: "0.4.19"}
            ,{ version: "0.6.0" }
        ]
    },
    namedAccounts: {
        deployer: {
            default: 0,
        },
        player: {
            default: 1,
        },
    },
    mocha: {
        timeout: 200000
    },
    /*
    etherscan: {
        apiKey: {
          polygonMumbai: MUMBAI_API,
          goerli: ETHERSCAN_API,
          bscTestnet: BSCSCAN_API_KEY
        }
    }
    */
};