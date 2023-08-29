// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
const {keccak256} = require('js-sha3')
const sha3 = require('web3-utils').sha3

const {Database} = require('../deployments')


const db = new Database(false)

const redeploy = true

const { ethers, network,getNamedAccounts } = hre
let depalyStep = 5000

const delay = (delayInms) => {
  console.log("Delay: ", delayInms)
  return new Promise(resolve => setTimeout(resolve, delayInms));
}

const atAddress = async (smc) => {
    let address = await db.read(
        network.name, smc
    )
    return await hre.ethers.getContractAt(
        smc,
        address
    )
}


async function main() {
    const registry = await atAddress("ENSRegistry")
    const registrar = await atAddress('BaseRegistrarImplementation')
    const nameWrapper = await atAddress('NameWrapper')
    const reverseRegistrar = await atAddress('ReverseRegistrar')
    const priceOracle = await atAddress(
        'StablePriceOracle')


    const controller = await atAddress('ETHRegistrarController')

  // Step: Deploy PublicResolver
  const resolver = await atAddress('PublicResolver')

  console.log("PublicResolver :", resolver.address)

  // Set default setDefaultResolver

  let txdf = await reverseRegistrar.setDefaultResolver(
      resolver.address
    )
  console.log(
    "set setDefaultResolver  for reverseRegistrar ", resolver.address, txdf.hash
  )
  await txdf.wait()

  await delay(depalyStep)

  let txq = await nameWrapper.setController(controller.address, true)
  console.log("Set controller of nameWrapper for controller ", txq.hash)
  await txq.wait(1)

  // console.log(nameWrapper.address)
  await delay(depalyStep)

  let txb = await registrar.addController(nameWrapper.address)
  console.log("Set controller of registrar for nameWrapper ", txb.hash)
  await txb.wait(1)
  await delay(depalyStep)

  let txRe = await reverseRegistrar.setController(controller.address, true)
  console.log("Set controller of reverseRegistrar for controller ", txRe.hash)
  await txRe.wait(1)

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
