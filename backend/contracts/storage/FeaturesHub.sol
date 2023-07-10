// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import {DataTypes} from "../libraries/DataTypes.sol";
import {IAccessControl} from "../interfaces/IAccessControl.sol";

contract FeaturesHub is Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _missionIds;

    mapping(address => mapping(uint => uint[])) indexersList;
    mapping(uint => address) featuresList;

    IAccessControl accessControl;

    constructor(address _accessControl) {
        accessControl = IAccessControl(_accessControl);
        accessControl.setFeaturesHub(address(this));
    }
}
