// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {DataTypes} from "../libraries/DataTypes.sol";

interface ICVHub {
    function getCollectFollowCv() external view returns (address);

    function getTokensLength() external view returns (uint);

    function getCV(address _from) external view returns (uint);

    function getCV(uint _cvID) external view returns (address);

    function mint(address _from, string calldata _tokenURI) external;

    function ownerOf(uint256 tokenId) external view returns (address owner);
}
