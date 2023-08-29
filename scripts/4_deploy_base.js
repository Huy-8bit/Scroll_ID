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
const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

const EMPTY_BYTES =
  "0x0000000000000000000000000000000000000000000000000000000000000000";

const db = new Database(false);

const redeploy = true;

const { ethers, network, getNamedAccounts } = hre;
let depalyStep = 2000;

const delay = (delayInms) => {
  console.log("Delay: ", delayInms);
  return new Promise((resolve) => setTimeout(resolve, delayInms));
};

const atAddress = async (smc) => {
  let address = await db.read(network.name, smc);
  return await hre.ethers.getContractAt(smc, address);
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
  console.log("network", network, getNamedAccounts);

  // Step 1: ENSRegistry
  const registry = await atAddress("ENSRegistry");

  // Deploy root: Root
  const [owner] = await ethers.getSigners();
  console.log("owner", owner.address);

  const root = await atAddress("Root");

  // Step 2: BaseRegistrarImplementation

  const registrar = await deploySMC("BaseRegistrarImplementation", [
    registry.address,
    hre.ethers.utils.namehash("scroll"),
  ]);
  await delay(depalyStep);

  let txjj = await root.setSubnodeOwner(
    "0x" + keccak256("scroll"),
    registrar.address
  );

  console.log("Set controller of .scroll for controller ", txjj.hash);
  await txjj.wait(1);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
