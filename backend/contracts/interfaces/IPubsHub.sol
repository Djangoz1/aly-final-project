// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {DataTypes} from "../libraries/DataTypes.sol";

// import {} from "./interfaces/..sol";

interface IPubsHub {
    function getTokensLength() external view returns (uint);

    function getIndexer(address _cv) external view returns (uint[] memory);

    function mint(
        uint _cvID,
        string calldata _tokenURI
    ) external returns (uint);

    function likePub(uint _cvID, uint _id) external;

    function unlikePub(uint _cvID, uint _id) external;
}
