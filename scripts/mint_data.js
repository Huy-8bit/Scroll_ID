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
  // console.log('network', network, getNamedAccounts)
  const _label = "dangnq123";
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

  const reverse_namehash = hre.ethers.utils.namehash("reverse");
  const addr_labelhash = "0x" + keccak256("addr");
  const test =
    "0x" +
    keccak256(
      ethers.utils.solidityPack(
        ["bytes32", "bytes32"],
        [reverse_namehash, addr_labelhash]
      )
    );
  console.log("Test = ", test);

  const addr_reverse_owner = await ens.owner(test);
  console.log("#*. check owner of addr.reverse", addr_reverse_owner);

  let callData = [
    resolver.interface.encodeFunctionData("setAddr(bytes32,address)", [
      hre.ethers.utils.namehash(name),
      registrantAccount,
    ]),
    resolver.interface.encodeFunctionData("setText", [
      hre.ethers.utils.namehash(name),
      "url",
      "scroll.com",
    ]),
  ];
  var commitment = await registrarController.makeCommitment(
    _label,
    owner.address, //registrantAccount,
    REGISTRATION_TIME,
    secret,
    publicResolverAddress,
    [],
    true,
    0
  );
  // console.log("call makeCommitment ", registrarControllerAddress)
  console.log("makeCommitment", commitment);
  const commitTime1 = await registrarController.commitments(commitment);
  console.log("* Commitment 1 : ", commitTime1);

  let txC = await registrarController.commit(commitment);
  await txC.wait();
  console.log("Done commit");

  console.log("available", await registrarController.available(name));
  console.log("prices", await registrarController.prices());

  const minTime = await registrarController.minCommitmentAge();
  const maxTime = await registrarController.maxCommitmentAge();
  console.log("Min time = ", minTime);
  console.log("Max time = ", maxTime);

  const commitTime2 = await registrarController.commitments(commitment);
  console.log("* Commitment : ", commitTime2);
  // console.log('available', commitTime2, commitTime2.toNumber() + minTime.toNumber(), commitTime2.toNumber() + maxTime.toNumber())
  const _currentBlockTimestamp = await registrarController.getBlockTimeStamp();
  console.log("* Block.timestamp = ", _currentBlockTimestamp);

  // console.log('available', commitTime.toNumber() + minTime - new Date().getTime()/1000 -7*60*60, commitTime.toNumber() + maxTime - new Date().getTime()/1000 -7*60*60)
  // const tx1 = await priceOracle.setDiscountForHolderOfscroll(
  //     true
  // )
  await delay(1 * 1000);
  console.log("Start registration");
  let prices = await priceOracle.price(
    name,
    0,
    REGISTRATION_TIME,
    owner.address
  );
  console.log("price", prices, prices[0].toNumber() * 100);
  // console.log('controllers',REGISTRATION_TIME - (await registrarController.MIN_REGISTRATION_DURATION()).toNumber())
  var txDone = await registrarController.register(
    _label,
    owner.address,
    REGISTRATION_TIME,
    secret,
    publicResolverAddress,
    [],
    true,
    0,
    {
      value: prices[0].toNumber() * 100,
    }
  );
  console.log("txDone", txDone);
  await txDone.wait();
  console.log("Done registration");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
