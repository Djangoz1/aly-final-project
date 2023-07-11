// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import {DataTypes} from "../libraries/DataTypes.sol";

// import {IAccessControl} from "../interfaces/IAccessControl.sol";

interface IFeaturesHub {
    // Ajoutez votre code ici

    function createFeature(
        address _for,
        DataTypes.FeatureData memory _featureData
    ) external;

    function getFeatureById(uint _id) external view returns (address);

    function getIndexersByAddress(
        address _for
    ) external view returns (uint256[] memory);
}
