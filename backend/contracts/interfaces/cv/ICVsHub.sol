// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {DataTypes} from "../../libraries/DataTypes.sol";

interface ICVsHub {
    function cvOfsDatasHub() external view returns (address);

    function tokensLength() external view returns (uint);

    function cvOf(address _from) external view returns (uint);

    function cvOf(uint _cvID) external view returns (address);

    function mint(address _from, string calldata _tokenURI) external;

    function ownerOf(uint256 tokenId) external view returns (address owner);

    function setAcceptToken(uint _cvID) external;

    function isAcceptToken(uint _cvID) external view returns (bool);
}
