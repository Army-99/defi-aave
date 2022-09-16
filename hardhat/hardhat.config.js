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
        /*
        localhost: {
            chainId: 31337,
            blockConfirmations: 1
        },
        goerli: {
            chainId: 5,
            blockConfirmations: 6,
            url: GOERLI_RPC_URL,
            accounts: [PRIVATE_KEY]
        },
        mumbai: {
            chainId: 80001,
            blockConfirmations: 6,
            url: MUMBAI_RPC_URL,
            accounts: [PRIVATE_KEY]
        },
        bsctestnet: {
            chainId: 97,
            blockConfirmations: 6,
            url: BSC_RPC_URL,
            accounts: [PRIVATE_KEY]
        },
        */
        hardhat: {
            forking: {
            url: MAINNET_RPC_URL
            }
        }
    },
    //solidity: "0.8.7",
    solidity: {
        compilers: [{ version: "0.8.7" }, { version: "0.6.6" }, { version: "0.4.19" }]
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