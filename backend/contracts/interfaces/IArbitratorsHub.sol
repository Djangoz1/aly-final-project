// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import {DataTypes} from "../libraries/DataTypes.sol";
import {IAccessControl} from "../interfaces/IAccessControl.sol";
import {ICVHub} from "../interfaces/ICVHub.sol";
import {IAddressHub} from "../interfaces/IAddressHub.sol";

interface IArbitratorsHub {
    function NB_COURT() external view returns (uint256);

    function setArbitrator(uint _cvID, DataTypes.CourtIDs _courtID) external;

    function investOnCourt(DataTypes.CourtIDs _courtID) external payable;

    function withdrawFromCourt(
        DataTypes.CourtIDs _courtID,
        uint _amount
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

    function getCourtLength(
        DataTypes.CourtIDs _courtID
    ) external view returns (uint256);

    function getData(
        uint256 _arbitratorID
    ) external view returns (DataTypes.ArbitratorData memory);

    function getArbitrationOfCV(
        uint _cvID,
        DataTypes.CourtIDs _courtID
    ) external view returns (uint256);

    function incrementVote(uint cvID, DataTypes.CourtIDs _courtID) external;

    function ownerOf(uint256 tokenId) external view returns (address owner);
}
