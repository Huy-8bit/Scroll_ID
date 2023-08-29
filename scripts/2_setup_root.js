// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
const { keccak256 } = require("js-sha3");
const sha3 = require("web3-utils").sha3;

const { Database } = require("../deployments");
const ZERO_HASH =
  "0x0000000000000000000000000000000000000000000000000000000000000000";

const db = new Database(false);

const redeploy = false;

const { ethers, network, getNamedAccounts } = hre;
let depalyStep = 5000;

const atAddress = async (smc) => {
  let address = await db.read(network.name, smc);
  return await hre.ethers.getContractAt(smc, address);
};

const delay = (delayInms) => {
  console.log("Delay: ", delayInms);
  return new Promise((resolve) => setTimeout(resolve, delayInms));
};

const deploySMC = async (name, args = []) => {
  let address = await db.read(network.name, name);
  if (address && !redeploy) {
    const is = await hre.ethers.getContractAt(name, address);
    return is;
  } else {
    console.log("deploy: ", name);
    await delay(depalyStep);
    const smc = await hre.ethers.getContractFactory(name);
    const ins = await smc.deploy(...args);
    await ins.deployTransaction.wait(1);

    await db.write(network.name, name, ins.address);
    console.log("Address of ", name, " ", ins.address);
    return ins;
  }
};

async function main() {
  const registry = await atAddress("ENSRegistry");

  const [owner] = await ethers.getSigners();

  const root = await atAddress("Root");

  const tx1 = await registry.setOwner(ZERO_HASH, root.address);
  console.log(
    `Setting owner of root node to root contract (tx: ${tx1.hash})...`
  );
  await tx1.wait(1);

  await delay(depalyStep);

  let tx2 = await root.setController(owner.address, true);
  console.log(`Setting controller of root to owner on  (tx: ${tx2.hash})...`);

  await tx2.wait(1);

  await delay(depalyStep);

  const _tx1 = await root.setSubnodeOwner(
    "0x" + keccak256("reverse"),
    owner.address
  );
  console.log(
    `Setting owner of .reverse to owner on root (tx: ${_tx1.hash})...`
  );
  await _tx1.wait(1);

  await delay(depalyStep);
  let _txo = await root.setSubnodeOwner(sha3("reverse"), owner.address);
  console.log(
    `Setting owner of .reverse to owner on registry (tx: ${_txo.hash})...`
  );
  await _txo.wait(1);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
