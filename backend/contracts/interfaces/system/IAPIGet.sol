// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {DataTypes} from "../../libraries/DataTypes.sol";

import {DisputeArbitrators} from "../../libraries/disputes/DisputeArbitrators.sol";
import {DisputeTimes} from "../../libraries/disputes/DisputeTimes.sol";
import {DisputeTools} from "../../libraries/disputes/DisputeTools.sol";
import {DisputeDatas} from "../../libraries/disputes/DisputeDatas.sol";
import {DisputeCounters} from "../../libraries/disputes/DisputeCounters.sol";
import {DisputeRules} from "../../libraries/disputes/DisputeRules.sol";

interface IAPIGet {
    // Ajoutez votre code ici

    // ---------------------------- //
    // ************ GENERAL ************ //
    // ************ -- ************ //

    function balanceOfToken(
        uint _cvID,
        address _ercAddr
    ) external view returns (uint);

    function ownerOfToken(
        uint _tokenID,
        address _ercAddr
    ) external view returns (address);

    function indexerOfToken(
        uint _tokenID,
        address _contract
    ) external view returns (uint[] memory);

    function tokenURIOf(
        uint _tokenID,
        address _ercAddr
    ) external view returns (string memory);

    function tokensLengthOf(address _ercAddr) external view returns (uint);

    // ---------------------------- //
    // ************ CV ************ //
    // ************ -- ************ //

    function cvOf(address _for) external view returns (uint);

    function followerOf(uint _cvID, uint _index) external view returns (uint);

    function followedOf(uint _cvID, uint _index) external view returns (uint);

    function lengthOfFollower(uint _cvID) external view returns (uint);

    function lengthOfFollowed(uint _cvID) external view returns (uint);

    function isFollow(uint _cvID, uint _cvFollow) external view returns (bool);

    // ---------------------------- //
    // ********** Escrows ********* //
    // ********* Arbitrator ******* //

    function lengthOfCourt(
        DataTypes.CourtIDs _courtID
    ) external view returns (uint);

    function arbitrationOfCV(
        uint _cvID,
        DataTypes.CourtIDs _courtID
    ) external view returns (uint256);

    function balanceOfCourt(
        DataTypes.CourtIDs _courtID
    ) external view returns (uint);

    function datasOfArbitrator(
        uint _arbitratorID
    ) external view returns (DataTypes.ArbitratorData memory);

    // ********** Dispute Data ********* //

    function addressOfDispute(uint _disputeID) external view returns (address);

    function disputeOfFeature(uint _featureID) external view returns (uint);

    function lengthOfDisputes() external view returns (uint);

    function datasOfDispute(
        uint _disputeID
    ) external view returns (DisputeDatas.Data memory);

    function arbitratorsOfDispute(
        uint _disputeID
    ) external view returns (uint[] memory);

    function timersOfDispute(
        uint _disputeID
    ) external view returns (DisputeTimes.Data memory _data);

    function rulesOfDispute(
        uint _disputeID
    ) external view returns (DisputeRules.Data memory _data);

    function voteOfArbitrator(
        uint _disputeID,
        uint _arbitratorID
    ) external view returns (DisputeRules.Vote);

    function countersOfDispute(
        uint _disputeID
    ) external view returns (DisputeCounters.Data memory _data);

    function allowanceOfArbitrator(
        uint _disputeID,
        uint _arbitratorID
    ) external view returns (DisputeArbitrators.Status);

    // ---------------------------- //
    // ******** LAUNCHPAD ********* //
    // ******** --------- ********* //

    function addressOfLaunchpad(
        uint _launchpadID
    ) external view returns (address);

    function launchpadsOfCV(uint _cvID) external view returns (uint[] memory);

    function datasOfLaunchpad(
        uint _launchpadID
    ) external view returns (DataTypes.LaunchpadData memory);

    // function currentTierIDOf(uint _launchpadID) external view returns (uint);

    // function tierOfLaunchpad(
    //     uint _launchpadID,
    //     uint _tierID
    // ) external view returns (DataTypes.TierData memory);

    function statusOfLaunchpad(
        uint _launchpadID
    ) external view returns (DataTypes.LaunchpadStatus);

    function datasOfInvestor(
        uint _launchpadID,
        uint _cvID
    ) external view returns (DataTypes.InvestorData memory);

    // ---------------------------- //
    // *********** PUBS *********** //
    // *********** ---- *********** //

    function datasOfPub(
        uint _pubID
    ) external view returns (DataTypes.PubData memory);

    function pubsOfMission(
        uint _missionID
    ) external view returns (uint[] memory);

    // ---------------------------- //
    // *********** WORKS *********** //
    // *********** ---- *********** //

    function jobsOfCV(uint _cvID) external view returns (uint[] memory);

    function invitesOfCV(uint _cvID) external view returns (uint[] memory);

    function datasOfMission(
        uint _missionID
    ) external view returns (DataTypes.MissionData memory);

    function datasOfFeature(
        uint _featureID
    ) external view returns (DataTypes.FeatureData memory);

    function datasOfWork(
        uint _featureID
    ) external view returns (DataTypes.FeatureInteractionData memory);
}
