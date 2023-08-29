//SPDX-License-Identifier: MIT
pragma solidity ~0.8.17;

import {IMetadataService} from "./IMetadataService.sol";
import '@openzeppelin/contracts/utils/Strings.sol';

contract StaticMetadataService is IMetadataService {
    string public _uri;
    using Strings for uint256;

    constructor(string memory _metaDataUri) {
        _uri = _metaDataUri;
    }
   function addressToString(address _addr) public pure returns(string memory) 
    {
        bytes32 value = bytes32(uint256(uint160(_addr)));
        bytes memory alphabet = "0123456789abcdef";
    
        bytes memory str = new bytes(51);
        str[0] = '0';
        str[1] = 'x';
        for (uint256 i = 0; i < 20; i++) {
            str[2+i*2] = alphabet[uint8(value[i + 12] >> 4)];
            str[3+i*2] = alphabet[uint8(value[i + 12] & 0x0f)];
        }
        return string(str);
    }
    function uri(address nft,uint256 tokenId) public view returns (string memory) {
        return string(abi.encodePacked(_uri,addressToString(nft),"/", tokenId.toString()));
    }
}
