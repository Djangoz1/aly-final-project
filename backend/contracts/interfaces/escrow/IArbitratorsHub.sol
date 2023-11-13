// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {DataTypes} from "../../libraries/DataTypes.sol";

interface IArbitratorsHub {
    function NB_COURT() external view returns (uint256);

    function setArbitrator(uint _cvID, DataTypes.CourtIDs _courtID) external;

    function acceptArbitration(
        uint _cvID,
        DataTypes.CourtIDs _courtID,
        uint _disputeID
    ) external;

    function indexerOf(
        DataTypes.CourtIDs _courtID
    ) external view returns (uint256[] memory);

    function boostRandomlyArbitrator(
        DataTypes.CourtIDs _courtID,
        uint _rand
    ) external view returns (uint256);

    function isBanned(uint256 _cvID) external view returns (bool);

    function randomlyArbitrator(
        DataTypes.CourtIDs _courtID,
        uint256 _randomID
    ) external view returns (uint256);

    function lengthOfCourt(
        DataTypes.CourtIDs _courtID
    ) external view returns (uint256);

    // function dataOf(
    //     uint256 _arbitratorID
    // ) external view returns (DataTypes.ArbitratorData memory);

    function incrementSuspectVote(uint256 _arbitratorID) external;

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
