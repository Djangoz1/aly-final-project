// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

import {DataTypes} from "../libraries/DataTypes.sol";
// import {} from "./interfaces/..sol";

interface IPub {

    function getMetadata() external view returns(string memory);

    // function setMetadata(DataTypes.PubData memory _datas) internal;
}