// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

const { Database } = require("../deployments");

const db = new Database(false);

const redeploy = true;

const { ethers, network } = hre;
let depalyStep = 5000;

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
    return ins;
  }
};

async function main() {
  // Step 1: ENSRegistry
  const registry = await deploySMC("ENSRegistry");

  // Deploy root: Root
  const [owner] = await ethers.getSigners();
  console.log("owner", owner.address);

  const root = await deploySMC("Root", [registry.address]);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
