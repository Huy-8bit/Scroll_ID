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

const deploySMC = async (name, args = [], is_new = false) => {
  let address = await db.read(network.name, name);
  if (address && !is_new) {
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
  console.log(
    "nameWrapper",
    await nameWrapper.uri(
      "14909373926149136357267310674501900217831429574623710510722696584623135634240"
    )
  );
  const token1 = await deploySMC("Tokenscroll", ["dem", "SK"], (is_new = true));
  const token2 = await deploySMC("Tokenscroll", ["dem", "SK"], (is_new = true));
  const token3 = await deploySMC("Tokenscroll", ["dem", "SK"], (is_new = true));

  // console.log("leng", await priceOracle.tokenLength());

  // const tx1 = await priceOracle.setDiscountForHolderOfscroll(
  //     true
  // )
  // await tx1.wait()
  // const tx = await priceOracle.setTokenscroll(
  //     token.address,
  //     {
  //         "minAmount": 0,
  //         "maxRentTime": REGISTRATION_TIME+10
  //     }
  // )

  // await tx.wait()

  // let prices = await priceOracle.price(
  //     name,
  //     0,
  //     REGISTRATION_TIME,
  //     owner.address
  // )
  // console.log("price", prices,prices[0].toNumber())
  // const tx3 = await priceOracle.removeTokenscroll(
  //     token.address
  // )

  // await tx3.wait()
  // let prices2 = await priceOracle.price(
  //     name,
  //     1000000000,
  //     REGISTRATION_TIME,
  //     owner.address
  // )
  // console.log("price", prices2,prices[0].toNumber())
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
