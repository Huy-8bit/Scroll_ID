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

const DAY = 24 * 60 * 60;
const REGISTRATION_TIME = 365 * DAY;

const { ethers, network } = hre;

const addressOf = async (smc) => {
  return await db.read(network.name, smc);
};

async function main() {
  const [owner] = await ethers.getSigners();
  const registrantAccount = owner.address;

  const registrarControllerAddress = await addressOf("ETHRegistrarController");
  console.log("registrarControllerAddress: ", registrarControllerAddress);
  const registrarController = await hre.ethers.getContractAt(
    "ETHRegistrarController",
    registrarControllerAddress
  );

  var tx_withdraw = await registrarController.withdraw();
  await tx_withdraw.wait();
  console.log("Done", tx_withdraw);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
