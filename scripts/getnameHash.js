const hre = require("hardhat");
// const bluebird = require('bluebird')
const { evm } = require("../test-utils");
const { Database } = require("../deployments");
const { keccak256 } = require("js-sha3");
const db = new Database(false);

const checkNameHash = hre.ethers.utils.namehash("12.scroll");

console.log("checkNameHash", checkNameHash);
