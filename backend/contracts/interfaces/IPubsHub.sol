// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {DataTypes} from "../libraries/DataTypes.sol";

// import {} from "./interfaces/..sol";

interface IPubsHub {
    function getTokensLength() external view returns (uint);

    function getIndexer(address _cv) external view returns (uint[] memory);

    function postPub(
        address _cv,
        string calldata _tokenURI
    ) external returns (uint);
}
