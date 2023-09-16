// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {DataTypes} from "../../libraries/DataTypes.sol";

interface IArbitratorsHub {
    function NB_COURT() external view returns (uint256);

    function setArbitrator(uint _cvID, DataTypes.CourtIDs _courtID) external;

    function investOnCourt(
        uint _cvID,
        uint _amount,
        DataTypes.CourtIDs _courtID
    ) external payable;

    function withdrawFromCourt(
        uint _cvID,
        uint _amount,
        DataTypes.CourtIDs _courtID
    ) external;

    function boostRandomlyArbitrator(
        DataTypes.CourtIDs _courtID,
        uint _rand
    ) external view returns (uint256);

    function randomlyArbitrator(
        DataTypes.CourtIDs _courtID,
        uint256 _randomID
    ) external view returns (uint256);

    function balanceOfCourt(
        DataTypes.CourtIDs _courtID
    ) external view returns (uint256);

    function lengthOfCourt(
        DataTypes.CourtIDs _courtID
    ) external view returns (uint256);

    // function dataOf(
    //     uint256 _arbitratorID
    // ) external view returns (DataTypes.ArbitratorData memory);

    function incrementVote(uint cvID, DataTypes.CourtIDs _courtID) external;

    function ownerOf(uint256 tokenId) external view returns (address owner);

    function dataOf(
        uint256 _arbitratorID
    ) external view returns (DataTypes.ArbitratorData memory);

    function arbitrationOfCV(
        uint _cvID,
        DataTypes.CourtIDs _courtID
    ) external view returns (uint256);
}
