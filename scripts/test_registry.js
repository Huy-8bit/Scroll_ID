// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
const { keccak256 } = require("js-sha3");
const sha3 = require("web3-utils").sha3;
const packet = require("dns-packet");

const { Database } = require("../deployments");
const ZERO_HASH =
  "0x0000000000000000000000000000000000000000000000000000000000000000";
const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

const EMPTY_BYTES =
  "0x0000000000000000000000000000000000000000000000000000000000000000";

const db = new Database(false);

const redeploy = true;

const { ethers, network, getNamedAccounts } = hre;
let depalyStep = 5000;

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

function encodeName(name) {
  console.log(
    "endcode name",
    packet.name.encode(name),
    typeof packet.name.encode(name)
  );
  return "0x" + packet.name.encode(name).toString("hex");
}
const labelhash = (label) =>
  hre.ethers.utils.keccak256(hre.ethers.utils.toUtf8Bytes(label));

async function main() {
  const registry = await atAddress("ENSRegistry");
  const registrar = await atAddress("BaseRegistrarImplementation");
  const nameWrapper = await atAddress("NameWrapper");
  const reverseRegistrar = await atAddress("ReverseRegistrar");
  const priceOracle = await atAddress("StablePriceOracle");

  const controller = await atAddress("ETHRegistrarController");

  // Step: Deploy PublicResolver
  const resolver = await atAddress("PublicResolver");
  var nodehash = hre.ethers.utils.namehash("dev2dev11122.scroll");

  const BytesUtilsFactory = await ethers.getContractFactory(
    "contracts/wrapper/test/TestBytesUtils.sol:TestBytesUtils"
  );
  // BytesUtils = await BytesUtilsFactory.deploy()

  console.log("nameWrapper", nameWrapper);
  console.log("nameWrapper", nameWrapper["isWrapped(bytes32)"]);
  console.log("nodehash", nodehash);
  let name = await nameWrapper.names(nodehash);
  let nameCheck = encodeName("dev2dev11122.scroll");
  // var buf = Buffer.from(name, 'utf8');
  // let [hash, offset] = await BytesUtils.readLabel(encodeName('dev2dev11122.scroll'), 0)
  // console.log("labelhash",labelhash("dev2dev11122")==hash)

  console.log("ETH_NODE", nameCheck, name, nameCheck == name);

  console.log(
    "decode",
    packet.name.decode(
      Buffer.from("0c646576326465763131313232046d656d6500", "hex")
    )
  );
  let exitsRecord = await nameWrapper["isWrapped(bytes32)"](nodehash);
  console.log("PublicResolver :", exitsRecord);
  if (exitsRecord) {
    console.log("addr", await resolver.addr());
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
