// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import {DataTypes} from "../libraries/DataTypes.sol";

// import {IAccessControl} from "../interfaces/IAccessControl.sol";

interface IFeaturesHub {
    // Ajoutez votre code ici

    function createFeature(
        address _cv,
        DataTypes.FeatureData memory _data
    ) external  returns(uint);

    function getDatas(uint _id) external view returns(DataTypes.FeatureData memory _data);

}
