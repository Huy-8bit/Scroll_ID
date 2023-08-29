//SPDX-License-Identifier: MIT
pragma solidity ~0.8.17;

interface IMetadataService {
    function uri(address nft,uint256 tokenId) external view returns (string memory);
}
