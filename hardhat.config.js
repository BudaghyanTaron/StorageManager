require("dotenv").config();
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require('@openzeppelin/hardhat-upgrades');
require("@nomiclabs/hardhat-web3");

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  defaultNetwork: "testnet",
  networks: {
    hardhat: {},
    testnet: {
      url: "https://bsc-test01.gymnetwork.io/",
      accounts: [process.env.TESTNET_KEY],
    },
  },
  solidity: {
    compilers: [
      {
        version: "0.8.15",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
          viaIR: true
        },
      },
    ],
  },
  paths: {
    sources: "./contracts",
    tests: "./tests",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  mocha: {
    enabledTimeouts: false,
    timeout: 100000000,
  },
  etherscan: {
    //apiKey: "9ZP43VDB3ZD4IHUV2SKMTUMI34WGZTBGPD",
    apiKey: "RHMWFECDQBYMDPMCZ9JAD2HN4IZ974ZI7B",
  }
};
