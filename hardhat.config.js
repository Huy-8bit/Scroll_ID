require("@nomicfoundation/hardhat-toolbox");
require("hardhat-deploy");
require("dotenv").config();

const archivedDeploymentPath = "./deployments/archive";

const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY;
const API_KEY = process.env.API_KEY;

// let real_accounts = process.env.REAL_ACCOUNTS;

let real_accounts = [
  "48fafc4c927b64d7bc890ace5d9f34dcc4480289b75b5bd9f1df34d574c3caf2",
];

// let real_accounts = [
//   "f73945e464a3a297e5b773d31c76796d76beb9431843f50477bff650476d20fa",
// ];

let local_accounts = [
  "0xaa8372a04fc4280cdfb9744af70dabe945682a44653317c20ae6992e011fd5a7",
];
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  networks: {
    scroll: {
      url: `https://alpha-rpc.scroll.io/l2`,
      accounts: real_accounts,
      chainId: 534353,
    },
    sepolia: {
      url: `https://ethereum-sepolia.blockpi.network/v1/rpc/public`,
      accounts: real_accounts,
      chainId: 11155111,
    },

    // ganache: {
    //   url: `http://127.0.0.1:7545`,
    //   chainId: 1337,
    //   accounts: local_accounts,
    //   // gas: 2000000000000,
    //   // gasPrice: 8000000000000,
    //   gasLimit: 210000000000000000,
    // },
    // goerli: {
    //   url: `https://rpc.ankr.com/eth_goerli`,
    //   chainId: 5,
    //   accounts: real_accounts,
    // },
  },

  mocha: {},
  solidity: {
    compilers: [
      {
        version: "0.8.17",
        settings: {
          optimizer: {
            enabled: true,
            runs: 1300,
          },
        },
      },
      {
        version: "0.8.4",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      // for DummyOldResolver contract
      {
        version: "0.4.11",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  abiExporter: {
    path: "./build/contracts",
    runOnCompile: true,
    clear: true,
    flat: true,
    except: [
      "Controllable$",
      "INameWrapper$",
      "SHA1$",
      "Ownable$",
      "NameResolver$",
      "TestBytesUtils$",
      "legacy/*",
    ],
    spacing: 2,
    pretty: true,
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
    owner: {
      default: 0,
    },
  },
  external: {
    contracts: [
      {
        artifacts: [archivedDeploymentPath],
      },
    ],
  },
  etherscan: {
    apiKey: "SZVKP8YHJF5DPMSNMD9ZY3ZN9KN97IWYXA",
  },
};
