// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;



import {DataTypes} from "../libraries/DataTypes.sol";
// import {} from "./interfaces/..sol";

interface IAccessControl {
    function setPubHub(address _pubHub) external;
    function setFactoryCV(address _factoryCV) external;
    function setFactoryMission(address _factoryMission) external;
    function hasCVAllowance() external;
}