const HDWalletProvider = require("@truffle/hdwallet-provider");
const PrivateKeyProvider = require("truffle-privatekey-provider");

const fs = require("fs");
const mnemonic = fs.readFileSync(".secret").toString().trim();
const privateKey = fs.readFileSync(".private_key").toString().trim();
console.log("Private Key = ", privateKey);

module.exports = {
  networks: {
    mainnet: {
      provider: () =>
        new HDWalletProvider(
          privateKey,
          `https://mainnet.infura.io/v3/05193ee480e548b990b9f5e5ac2897d2`
        ),
      network_id: 1,
      skipDryRun: true,
      production: true,
      timeoutBlocks: 200,
      confirmations: 2
    },
    goerli_testnet: {
      provider: () =>
        new HDWalletProvider(
          privateKey,
          `https://goerli.infura.io/v3/05193ee480e548b990b9f5e5ac2897d2`
        ),
      network_id: 5,
      skipDryRun: true,
      production: true,
      timeoutBlocks: 200,
      confirmations: 2,
    },
    okx_testnet: {
      provider: () =>
        new HDWalletProvider(mnemonic, `https://exchaintestrpc.okex.org`),
      network_id: 65,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true,
    },
    ganache: {
      host: "127.0.0.1", // Localhost (default: none)
      port: 7545, // Standard Ethereum port (default: none)
      network_id: "*", // Any network (default: none)
      skipDryRun: true,
      production: true,
      gasPrice: 128,
      timeoutBlocks: 200,
      from: "0x8A2d4aa635EE380511Da255623048BE618343185",
      // from: '0x5aB35D7b88bdAC5605E43A02266492C5716Ca6D3'
    },
    ganache2: {
      host: "127.0.0.1", // Localhost (default: none)
      port: 7545, // Standard Ethereum port (default: none)
      network_id: "*", // Any network (default: none)
      skipDryRun: true,
      production: true,
      gasPrice: 20000000000,
      timeoutBlocks: 200,
      from: "0xDe4F8141AaCC9b84D40dDcB8dAA8Eb080BdFeA5D",
    },
    bsc_testnet: {
      // provider: () => new PrivateKeyProvider(privateKey, `https://data-seed-prebsc-1-s2.binance.org:8545/`),
      // provider: () => new PrivateKeyProvider(privateKey, `https://endpoints.omniatech.io/v1/bsc/testnet/public`),
      provider: () =>
        new HDWalletProvider(
          mnemonic,
          `https://data-seed-prebsc-1-s1.binance.org:8545/`
        ),
      network_id: 97,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true,
      gasPrice: 40000000000,
    },
    polygon_testnet: {
      provider: () =>
        new HDWalletProvider(
          mnemonic,
          `https://polygon-mumbai-bor.publicnode.com`
        ),
      network_id: 80001,
      confirmations: 2,
      gasPrice: 50000000000,
      networkCheckTimeout: 100000,
      timeoutBlocks: 2000,
      skipDryRun: true,
    },
    base_goerli: {
      provider: () =>
        new HDWalletProvider(
          mnemonic,
          `https://base-goerli.public.blastapi.io`
        ),
      network_id: "*",
      skipDryRun: true,
      production: true,
      timeoutBlocks: 200,
      confirmations: 2,
    },
    scroll_alpha_testnet: {
      provider: () =>
        new HDWalletProvider(
          mnemonic,
          `https://scroll-testnet.blockpi.network/v1/rpc/public`
        ),
      network_id: 534353,
      timeoutBlocks: 200,
      skipDryRun: true,
      confirmations: 2,
    },
  },

  // Set default mocha options here, use special reporters etc.
  mocha: {
    // timeout: 100000
  },

  plugins: ["truffle-contract-size"],

  // Configure your compilers
  compilers: {
    solc: {
      // version: "0.8.10",   // For the NFT system
      version: "0.8.19", // For the Marketplace
      settings: {
        optimizer: {
          enabled: true,
          runs: 200,
        },
      },
    },
  },
};
