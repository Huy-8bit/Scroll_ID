//SPDX-License-Identifier: MIT
pragma solidity ~0.8.17;

import "./IPriceOracle.sol";
import "./StringUtils.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/introspection/IERC165.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface AggregatorInterface {
    function latestAnswer() external view returns (int256);
}

// StablePriceOracle sets a price in USD, based on an oracle.
contract StablePriceOracle is IPriceOracle, Ownable {
    using StringUtils for *;

    // Rent in base price units by length
    uint256 public immutable price1Letter;
    uint256 public immutable price2Letter;
    uint256 public immutable price3Letter;
    uint256 public immutable price4Letter;
    uint256 public immutable price5Letter;

    //    bool public discountForHolderOfscroll = false;
    // IERC20 token;
    //
    //    mapping(address => scrollToken) public scrollTokenConfig;
    //    address[] public scrollTokens;

    // Oracle address
    AggregatorInterface public immutable usdOracle;

    event RentPriceChanged(uint256[] prices);

    //    function tokenLength() public view returns (uint256) {
    //        return scrollTokens.length;
    //    }

    constructor(AggregatorInterface _usdOracle, uint256[] memory _rentPrices) {
        usdOracle = _usdOracle;
        price1Letter = _rentPrices[0];
        price2Letter = _rentPrices[1];
        price3Letter = _rentPrices[2];
        price4Letter = _rentPrices[3];
        price5Letter = _rentPrices[4];
    }

    //    function setRentPrice(uint256[] memory _rentPrices) external onlyOwner {
    //        price1Letter = _rentPrices[0];
    //        price2Letter = _rentPrices[1];
    //        price3Letter = _rentPrices[2];
    //        price4Letter = _rentPrices[3];
    //        price5Letter = _rentPrices[4];
    //    }

    //    function setTokenscroll(
    //        address token,
    //        scrollToken memory config
    //    ) external onlyOwner {
    //        require(config.minAmount > 0, "ERROR: Min amount of token must be greater than 0");
    //        require(config.maxRentTime > 0, "ERROR: Max rent time of token must be greater than 0");
    //
    //        if(scrollTokenConfig[token].minAmount == 0) {
    //            scrollTokens.push(token);
    //        }
    //        scrollTokenConfig[token] = config;
    //    }
    //
    //    function removeTokenscroll(address token) external onlyOwner {
    //        uint256 zindex = 0;
    //        bool exists = false;
    //
    //        for (uint index = 0; index < scrollTokens.length; index++) {
    //            if (scrollTokens[index] == token) {
    //                exists = true;
    //                zindex = index;
    //            }
    //        }
    //
    //        require(exists, "ERROR:Token is not exitsts");
    //
    //        scrollTokens[zindex] = scrollTokens[scrollTokens.length - 1];
    //        scrollTokens.pop();
    //
    //        delete (scrollTokenConfig[token]);
    //    }

    function price(
        string calldata name,
        uint256 expires,
        uint256 duration,
        address user
    ) external view override returns (IPriceOracle.Price memory) {
        uint256 len = name.strlen();
        uint256 basePrice;

        if (len >= 5) {
            basePrice = price5Letter * duration;
        } else if (len == 4) {
            basePrice = price4Letter * duration;
        } else if (len == 3) {
            basePrice = price3Letter * duration;
        } else if (len == 2) {
            basePrice = price2Letter * duration;
        } else {
            basePrice = price1Letter * duration;
        }

        return
            IPriceOracle.Price({
                base: attoUSDToWei(basePrice),
                premium: attoUSDToWei(_premium(name, expires, duration))
            });
    }

    /**
     * @dev Returns the pricing premium in wei.
     */
    function premium(
        string calldata name,
        uint256 expires,
        uint256 duration
    ) external view returns (uint256) {
        return attoUSDToWei(_premium(name, expires, duration));
    }

    /**
     * @dev Returns the pricing premium in internal base units.
     */
    function _premium(
        string memory name,
        uint256 expires,
        uint256 duration
    ) internal view virtual returns (uint256) {
        return 0;
    }

    function attoUSDToWei(uint256 amount) internal view returns (uint256) {
        uint256 ethPrice = uint256(usdOracle.latestAnswer());
        return (amount * 1e8) / ethPrice;
    }

    function weiToAttoUSD(uint256 amount) internal view returns (uint256) {
        uint256 ethPrice = uint256(usdOracle.latestAnswer());
        return (amount * ethPrice) / 1e8;
    }

    function supportsInterface(
        bytes4 interfaceID
    ) public view virtual returns (bool) {
        return
            interfaceID == type(IERC165).interfaceId ||
            interfaceID == type(IPriceOracle).interfaceId;
    }
}
