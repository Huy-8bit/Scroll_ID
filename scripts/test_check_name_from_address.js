const hre = require("hardhat");
// const bluebird = require('bluebird')
const { evm } = require("../test-utils");
const { Database } = require("../deployments");
const db = new Database(false);

const delay = (delayInms) => {
  console.log("Delay: ", delayInms);
  return new Promise((resolve) => setTimeout(resolve, delayInms));
};
const secret =
  "0x0123456789ABCDEF0123456789ABCDEF0123456789ABCDEF0123456789ABCDEF";
const ZERO_HASH =
  "0x0000000000000000000000000000000000000000000000000000000000000000";
const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

const DAY = 24 * 60 * 60;
const REGISTRATION_TIME = 29 * DAY;
const BUFFERED_REGISTRATION_COST = REGISTRATION_TIME + 3 * DAY;
const GRACE_PERIOD = 90 * DAY;
const NULL_ADDRESS = ZERO_ADDRESS;
const { ethers, network, getNamedAccounts } = hre;

const addressOf = async (smc) => {
  return await db.read(network.name, smc);
  const nameWrapperAddress = await addressOf("NameWrapper");

  const nameWrapper = await hre.ethers.getContractAt(
    "NameWrapper",
    nameWrapperAddress
  );
};

const deploySMC = async (name, args = []) => {
  let address = await db.read(network.name, name);
  if (address) {
    const is = await hre.ethers.getContractAt(name, address);
    return is;
  } else {
    console.log("deploy: ", name);
    const smc = await hre.ethers.getContractFactory(name);
    const ins = await smc.deploy(...args);
    await db.write(network.name, name, ins.address);
    console.log("Address of ", name, " ", ins.address);
    return ins;
  }
};

async function main() {
  console.log("network", network, getNamedAccounts);
  const _label = "dev2dev11122";
  const name = _label + ".scroll";
  const [owner] = await ethers.getSigners();
  const registrantAccount = owner.address;

  const publicResolverAddress = await addressOf("PublicResolver");

  const resolver = await hre.ethers.getContractAt(
    "PublicResolver",
    publicResolverAddress
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
