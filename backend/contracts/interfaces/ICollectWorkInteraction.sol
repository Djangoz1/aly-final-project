// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

import {DataTypes} from "../libraries/DataTypes.sol";
import {IAccessControl} from "../interfaces/IAccessControl.sol";
import {IFeaturesHub} from "../interfaces/IFeaturesHub.sol";

interface ICollectWorkInteraction {
    function setFeature(uint _featureID) external;

    function acceptJob(uint _cvWorkerID, uint _featureID) external;
}
