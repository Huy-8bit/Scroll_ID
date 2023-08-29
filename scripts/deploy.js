// // We require the Hardhat Runtime Environment explicitly here. This is optional
// // but useful for running the script in a standalone fashion through `node <script>`.
// //
// // You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// // will compile your contracts, add the Hardhat Runtime Environment's members to the
// // global scope, and execute the script.
// const hre = require("hardhat");
// const {keccak256} = require('js-sha3')
// const sha3 = require('web3-utils').sha3
//
// const {Database} = require('../deployments')
// const ZERO_HASH =
//   '0x0000000000000000000000000000000000000000000000000000000000000000'
// const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'
//
// const EMPTY_BYTES =
//   '0x0000000000000000000000000000000000000000000000000000000000000000'
//
//
// const db = new Database(false)
//
// const redeploy = true
//
// const { ethers, network,getNamedAccounts } = hre
// let depalyStep = 1000
//
// const delay = (delayInms) => {
//   console.log("Delay: ", delayInms)
//   return new Promise(resolve => setTimeout(resolve, delayInms));
// }
//
// const deploySMC = async(name, args=[])=>{
//   let address = await db.read(
//     network.name, name
//   )
//   if(address && !redeploy){
//     const is = await hre.ethers.getContractAt(
//       name,
//       address
//     )
//     return is
//
//   } else {
//
//     console.log("deploy: ", name)
//     await delay(depalyStep)
//     const smc = await hre.ethers.getContractFactory(name)
//     const ins = await smc.deploy(...args);
//     await ins.deployTransaction.wait(1)
//
//     await db.write(network.name, name, ins.address)
//     console.log('Address of ', name, " ", ins.address)
//     return ins
//   }
// }
//
// async function main() {
//   console.log('network', network, getNamedAccounts)
//
//   // Step 1: ENSRegistry
//   const registry = await deploySMC("ENSRegistry")
//
//   // Deploy root: Root
//   const [owner] = await ethers.getSigners();
//   console.log('owner',owner.address)
//
//   const root = await deploySMC("Root", [
//     registry.address
//   ])
//
//   await delay(depalyStep)
//   const tx1 = await registry.setOwner(ZERO_HASH, root.address)
//   console.log(
//     `Setting owner of root node to root contract (tx: ${tx1.hash})...`,
//   )
//   await tx1.wait()
//
//   await delay(depalyStep)
//   let tx2 = await root.setController(
//     owner.address, true
//   )
//   console.log(`Setting setController of root to owner on root (tx: ${tx2.hash})...`)
//
//   await tx2.wait()
//
//   await delay(depalyStep)
//
//   const _tx1 = await root.setSubnodeOwner('0x' + keccak256('reverse'), owner.address)
//   console.log(`Setting owner of .reverse to owner on root (tx: ${_tx1.hash})...`)
//   await _tx1.wait()
//
//   // Step: Deploy ReverseRegistrar
//   const reverseRegistrar = await deploySMC('ReverseRegistrar', [
//     registry.address
//   ])
//
//   await delay(depalyStep)
//   let _txo = await root.setSubnodeOwner(sha3('reverse'), owner.address)
//   console.log(
//     `Setting owner of .reverse to owner on registry (tx: ${_txo.hash})...`,
//   )
//   await _txo.wait()
//
//   await delay(depalyStep)
//   let _tx2 = await registry.setSubnodeOwner(
//       hre.ethers.utils.namehash('reverse'),
//       '0x' + keccak256('addr'),
//       reverseRegistrar.address,
//     )
//   console.log(
//     `Setting owner of .addr.reverse to ReverseRegistrar on registry (tx: ${_tx2.hash})...`,
//   )
//   await _tx2.wait()
//
//
//   // Step 2: BaseRegistrarImplementation
//
//   const registrar = await deploySMC('BaseRegistrarImplementation',[
//     registry.address,
//     hre.ethers.utils.namehash("scroll")
//   ]
//   )
//   await delay(depalyStep)
//
//   let txjj = await root.setSubnodeOwner('0x' + keccak256('scroll'),registrar.address)
//
//   console.log("Set controller of .scroll for controller ", txjj.hash)
//   await txjj.wait();
//
//   // Step 3: StaticMetadataService
//
//   const metadata = await deploySMC('StaticMetadataService',['https://metadata.dotscroll.ai/v1/metadata/goerli/'])
//
//   // Step4: NameWrapper
//
//   const nameWrapper = await deploySMC('NameWrapper',[registry.address, registrar.address, metadata.address])
//
//   // const nameWrapper = await hre.ethers.getContract("NameWrapper");
//   // TODO setController:
//
//
//   // Step: Deploy priceOracle
//
//
//   let oracleAddress = '0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419'
//
//   if (network.name !== 'mainnet') {
//     const dummyOracle = await deploySMC('DummyOracle', ['10000'])
//     oracleAddress = dummyOracle.address
//   }
//   console.log("oracleAddress", oracleAddress)
//   const priceOracle = await deploySMC(
//     'StablePriceOracle',
//     [oracleAddress,
//     [0, 0, 4, 2, 1]]
//   )
//
//
//   // Step 5: ETHRegistrarController
//
//   const controller = await deploySMC('ETHRegistrarController', [
//     registrar.address,
//     priceOracle.address,
//     0,
//     86400,
//     reverseRegistrar.address,
//     nameWrapper.address,
//     registry.address]
//   )
//
//   // Step: Deploy PublicResolver
//   const resolver = await deploySMC('PublicResolver',[
//     registry.address,
//     nameWrapper.address,
//     controller.address,
//     reverseRegistrar.address]
//   )
//
//   console.log("PublicResolver :", resolver.address)
//   await delay(depalyStep)
//
//   let txq = await nameWrapper.setController(controller.address, true)
//   console.log("Set controller of nameWrapper for controller ", txq.hash)
//   await txq.wait()
//   await delay(depalyStep)
//
//   // console.log(nameWrapper.address)
//   let txb = await registrar.addController(nameWrapper.address)
//   console.log("Set controller of registrar for nameWrapper ", txb.hash)
//   await txb.wait()
//   await delay(depalyStep)
//
//   let txRe = await reverseRegistrar.setController(controller.address, true)
//   console.log("Set controller of reverseRegistrar for controller ", txRe.hash)
//   await txRe.wait()
//
//
// }
//
// // We recommend this pattern to be able to use async/await everywhere
// // and properly handle errors.
// main().catch((error) => {
//   console.error(error);
//   process.exitCode = 1;
// });
