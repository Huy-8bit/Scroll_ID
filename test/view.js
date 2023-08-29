const hre = require("hardhat");

console.log("ETH_NODE", hre.ethers.utils.namehash("scroll"));
const labelhash = (label) =>
  hre.ethers.utils.keccak256(hre.ethers.utils.toUtf8Bytes(label));

console.log("ETH_LABELHASH", labelhash("dev2dev11122"));

console.log("ADDR_REVERSE_NODE", hre.ethers.utils.namehash("addr.reverse"));
