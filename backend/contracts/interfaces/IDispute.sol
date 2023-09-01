// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";

import {DataTypes} from "../libraries/DataTypes.sol";

interface IDispute {
    // Ajoutez votre code ici
    function data() external view returns (DataTypes.DisputeData memory);
}
