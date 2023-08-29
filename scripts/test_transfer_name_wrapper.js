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

async function main() {
  console.log("network", network, getNamedAccounts);
  const _label = "taipa0410";
  const name = _label + ".scroll";
  const [owner] = await ethers.getSigners();
  const registrantAccount = owner.address;
  const eNSRegistryAddress = await addressOf("ENSRegistry");
  const ens = await hre.ethers.getContractAt("ENSRegistry", eNSRegistryAddress);

  const publicResolverAddress = await addressOf("PublicResolver");
  const resolver = await hre.ethers.getContractAt(
    "PublicResolver",
    publicResolverAddress
  );
  const priceOracleAddress = await addressOf("StablePriceOracle");

  const priceOracle = await hre.ethers.getContractAt(
    "StablePriceOracle",
    priceOracleAddress
  );
  const registrarControllerAddress = await addressOf("ETHRegistrarController");

  const registrarController = await hre.ethers.getContractAt(
    "ETHRegistrarController",
    registrarControllerAddress
  );
  const baseRegistrarImplementationAddress = await addressOf(
    "BaseRegistrarImplementation"
  );

  const baseRegistrarImplementation = await hre.ethers.getContractAt(
    "BaseRegistrarImplementation",
    baseRegistrarImplementationAddress
  );
  const nameWrapperAddress = await addressOf("NameWrapper");

  const nameWrapper = await hre.ethers.getContractAt(
    "NameWrapper",
    nameWrapperAddress
  );
  let isController = await nameWrapper.controllers(registrarControllerAddress);
  console.log("controllers", isController);
  const isControllerOfbaseRegistrarImplementation =
    await baseRegistrarImplementation.controllers(nameWrapper.address);
  const baseNode = await baseRegistrarImplementation.baseNode();
  console.log("baseNode", baseNode);
  console.log(
    "baseRegistrarImplementation",
    isControllerOfbaseRegistrarImplementation
  );
  console.log(
    "owner of root node",
    await ens.owner(baseNode),
    baseRegistrarImplementationAddress
  );

  var tokenId =
    "91527943469038551751707238133327405718252260812822942948124049864060294828166";
  var tx1 = await nameWrapper.safeTransferFrom();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
