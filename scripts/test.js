// test contract NameWrapper
const { expect } = require("chai");
const { ethers } = require("hardhat");
const fs = require("fs");
const { id } = require("ethers/lib/utils");

const contractAddress = "0xc421c48C632de2d76F8a0e1B7896117c191410f1";
const DAY = 24 * 60 * 60;
const REGISTRATION_TIME = 29 * DAY;
describe("ETHRegistrarController", function () {
  beforeEach(async function () {
    ETHRegistrarController = await ethers.getContractFactory(
      "ETHRegistrarController"
    );
    ethRegistrarController = await ETHRegistrarController.attach(
      contractAddress
    );
    console.log("ETHRegistrarController", ethRegistrarController.address);
    [owner] = await ethers.getSigners();
  });
  // it("Should return isWrapped", async function () {
  //   const namehash =
  //     "0x3b7de60c28af2893bf26c104692327e8c5498e8f327ade28e56c0aa6a3539e54";
  //   // console.log(nameWrapper);

  //   const result = await nameWrapper["isWrapped(bytes32)"](
  //     "0x3b7de60c28af2893bf26c104692327e8c5498e8f327ade28e56c0aa6a3539e54"
  //   );
  // });

  it("should return get data", async () => {
    const namehash =
      "0x3b7de60c28af2893bf26c104692327e8c5498e8f327ade28e56c0aa6a3539e54";
    const result = await ethRegistrarController.rentPrice(
      "huy",
      REGISTRATION_TIME,
      owner.address
    );
    console.log("result", result.base.toString());
    // convert to eth
    const price = ethers.utils.formatEther(result.base.toString(), "ether");
    console.log("price", price);
  });
});
