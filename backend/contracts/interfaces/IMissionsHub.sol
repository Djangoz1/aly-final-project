// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

// import {DataTypes} from "./libraries/DataTypes.sol";
// import {IAccessControl} from "./interfaces/IAccessControl.sol";

interface IMissionsHub {
    function createMission(
        address _cv,
        string calldata _tokenURI
    ) external returns (uint);

    function setFeatureMission(
        address _cv,
        uint _missionID,
        uint _featureID
    ) external;

    function checkRegistred(uint _id) external view;
}
