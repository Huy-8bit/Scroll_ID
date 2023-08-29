const hre = require("hardhat");
// const bluebird = require('bluebird')
const { evm } = require("../test-utils");
const { Database } = require("../deployments");
const { keccak256 } = require("js-sha3");
const db = new Database(false);

const delay = (delayInms) => {
  console.log("Delay: ", delayInms);
  return new Promise((resolve) => setTimeout(resolve, delayInms));
};

const addressOf = async (smc) => {
  return await db.read(network.name, smc);
};

async function main() {
  // console.log('network', network, getNamedAccounts)
  const _label = "dangnq123";
  const name = _label + ".scroll";
  const [owner] = await ethers.getSigners();
  const registrantAccount = owner.address;

  /**
   *      Node of owner in Reverse Registrar
   */
  const reverseRegistrarAddress = await addressOf("ReverseRegistrar");
  const reverseRegistrar = await hre.ethers.getContractAt(
    "ReverseRegistrar",
    reverseRegistrarAddress
  );
  var node = await reverseRegistrar.node(owner.address);
  console.log(`* Node of ${owner.address} is `, node);

  /**
   *      Name of node in Public Resolver
   */
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
