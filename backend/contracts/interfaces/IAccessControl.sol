// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;



import {DataTypes} from "../libraries/DataTypes.sol";
import {IPubHub} from "../interfaces/IPubHub.sol";


interface IAccessControl {
    function setPubHub(address _pubHub) external;
    function getPubHub() external returns(address);
    function setFactoryCV(address _factoryCV) external;
    function getFactoryCV() external returns(address);
    function setFactoryMission(address _factoryMission) external;
    function getFactoryMission() external returns(address);
    function buyCV() external returns(address);
    function getCVByAddress(address _addr) external view returns(address);
}