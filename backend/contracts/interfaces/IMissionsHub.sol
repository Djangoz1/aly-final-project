// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

// import {DataTypes} from "./libraries/DataTypes.sol";
// import {IAccessControl} from "./interfaces/IAccessControl.sol";

interface IMissionsHub {
    function createMission(
        address _cv,
        string calldata _tokenURI
    ) external returns (uint);

    function checkRegistred(uint _id) external view;
}
