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
  let names = [
    "scroll",
    "dogecoin",
    "doge",
    "shibainu",
    "shib",
    "pepe",
    "bone",
    "babydoge",
    "aidoge",
    "volt",
    "erc20",
    "vitalik",
    "elon",
    "elonmusk",
    "ethereum",
    "eth",
    "etherscan",
    "king",
    "queen",
    "9gag",
    "love",
    "xxx",
    "000",
    "111",
    "222",
    "333",
    "444",
    "555",
    "666",
    "777",
    "888",
    "999",
  ];

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

  for (let _label of names) {
    console.log("run mint for", _label);
    let name = _label + ".scroll";

    let callData = [
      resolver.interface.encodeFunctionData("setAddr(bytes32,address)", [
        hre.ethers.utils.namehash(name),
        registrantAccount,
      ]),
    ];
    var commitment = await registrarController.makeCommitment(
      _label,
      registrantAccount,
      REGISTRATION_TIME,
      secret,
      publicResolverAddress,
      callData,
      true,
      0
    );
    console.log("commit", commitment);
    let txC = await registrarController.commit(commitment);
    await txC.wait();
    let minTime = (await registrarController.minCommitmentAge()).toNumber();
    console.log("minTime", minTime);

    console.log("available", await registrarController.available(name));
    console.log("prices", await registrarController.prices());
    await delay(5000);

    const commitTime = await registrarController.commitments(commitment);
    console.log("commit at ", commitTime);
    await delay(minTime * 1000 + 10000);

    let prices = await priceOracle.price(
      name,
      0,
      REGISTRATION_TIME,
      owner.address
    );
    console.log("price", prices, prices[0].toNumber());
    // console.log('controllers',REGISTRATION_TIME - (await registrarController.MIN_REGISTRATION_DURATION()).toNumber())

    // let controllerOfBaseRegistrarImplementation =
    var txDone = await registrarController.register(
      _label,
      registrantAccount,
      REGISTRATION_TIME,
      secret,
      publicResolverAddress,
      callData,
      true,
      0,
      {
        value: (prices[0].toNumber() + prices[0].toNumber() * 9).toString(),
        // value: '25865368143378110'
      }
    );
    console.log("txDone", txDone);
    await txDone.wait();

    delay(5000);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
