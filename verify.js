// verify.js
const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  // Địa chỉ của hợp đồng A
  const contractAddress = "0xC87e9704C578F7C0769cbfB0b32511C53ACE748e";

  // Tạo một đối tượng Contract từ địa chỉ hợp đồng và mã nguồn hợp đồng
  const ETHRegistrarController = await hre.ethers.getContractAt(
    "ETHRegistrarController",
    contractAddress
  );

  // In ra địa chỉ của hợp đồng đã xác minh
  console.log(
    "Contract ETHRegistrarController address:",
    ETHRegistrarController.address
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
