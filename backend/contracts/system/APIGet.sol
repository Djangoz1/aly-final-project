// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import {DataTypes} from "../libraries/DataTypes.sol";
import {Bindings} from "../libraries/Bindings.sol";
import {IAddressSystem} from "../interfaces/system/IAddressSystem.sol";

import {IBalancesHub} from "../interfaces/system/IBalancesHub.sol";

import {DisputeArbitrators} from "../libraries/disputes/DisputeArbitrators.sol";
import {DisputeTimes} from "../libraries/disputes/DisputeTimes.sol";
import {DisputeTools} from "../libraries/disputes/DisputeTools.sol";
import {DisputeDatas} from "../libraries/disputes/DisputeDatas.sol";
import {DisputeCounters} from "../libraries/disputes/DisputeCounters.sol";
import {DisputeRules} from "../libraries/disputes/DisputeRules.sol";
import {ICVsHub} from "../interfaces/cv/ICVsHub.sol";
import {ICVsDatasHub} from "../interfaces/cv/ICVsDatasHub.sol";
import {IArbitratorsHub} from "../interfaces/escrow/IArbitratorsHub.sol";
import {IDispute} from "../interfaces/escrow/IDispute.sol";

import {IDisputesDatasHub} from "../interfaces/escrow/IDisputesDatasHub.sol";
import {IDisputesHub} from "../interfaces/escrow/IDisputesHub.sol";
import {IPubsHub} from "../interfaces/pubs/IPubsHub.sol";
import {IPubsDatasHub} from "../interfaces/pubs/IPubsDatasHub.sol";
import {IMissionsHub} from "../interfaces/works/IMissionsHub.sol";
import {IFeaturesHub} from "../interfaces/works/IFeaturesHub.sol";
import {ICollectWorkInteraction} from "../interfaces/works/ICollectWorkInteraction.sol";
import {ILaunchpadHub} from "../interfaces/launchpads/ILaunchpadHub.sol";
import {ILaunchpadsDatasHub} from "../interfaces/launchpads/ILaunchpadsDatasHub.sol";
import {ILaunchpadsInvestorsHub} from "../interfaces/launchpads/ILaunchpadsInvestorsHub.sol";
import {ILaunchpad} from "../interfaces/launchpads/ILaunchpad.sol";

contract APIGet {
    // Ajoutez votre code ici
    IAddressSystem _iAS;

    constructor(address _addressSystem) {
        _iAS = IAddressSystem(_addressSystem);
        // _iAS.setApiGet();
    }

    // ---------------------------- //
    // ************ CV ************ //
    // ************ -- ************ //

    function cvOf(address _for) external view returns (uint) {
        return Bindings.cvOf(_for, _iAS.cvsHub());
    }

    function lengthOfCVs() external view returns (uint) {
        return Bindings.tokensLength(_iAS.cvsHub());
    }

    function followerOf(uint _cvID, uint _index) external view returns (uint) {
        return ICVsDatasHub(_iAS.cvsDatasHub()).followerOf(_cvID, _index);
    }

    function followedOf(uint _cvID, uint _index) external view returns (uint) {
        return ICVsDatasHub(_iAS.cvsDatasHub()).followedOf(_cvID, _index);
    }

    function lengthOfFollower(uint _cvID) external view returns (uint) {
        return ICVsDatasHub(_iAS.cvsDatasHub()).lengthOfFollower(_cvID);
    }

    function lengthOfFollowed(uint _cvID) external view returns (uint) {
        return ICVsDatasHub(_iAS.cvsDatasHub()).lengthOfFollowed(_cvID);
    }

    function isFollow(uint _cvID, uint _cvFollow) external view returns (bool) {
        return ICVsDatasHub(_iAS.cvsDatasHub()).isFollow(_cvID, _cvFollow);
    }

    // ---------------------------- //
    // ********** Escrows ********* //
    // ********* Arbitrator ******* //

    function lengthOfCourt(
        DataTypes.CourtIDs _courtID
    ) external view returns (uint) {
        return IArbitratorsHub(_iAS.arbitratorsHub()).lengthOfCourt(_courtID);
    }

    function lengthOfArbitrators() external view returns (uint) {
        return Bindings.tokensLength(_iAS.arbitratorsHub());
    }

    function balanceOfCourt(
        DataTypes.CourtIDs _courtID
    ) external view returns (uint) {
        return IArbitratorsHub(_iAS.arbitratorsHub()).balanceOfCourt(_courtID);
    }

    function datasOfArbitrator(
        uint _arbitratorID
    ) external view returns (DataTypes.ArbitratorData memory) {
        return IArbitratorsHub(_iAS.arbitratorsHub()).dataOf(_arbitratorID);
    }

    // ********** Dispute Data ********* //

    function addressOfDispute(uint _disputeID) external view returns (address) {
        return IDisputesHub(_iAS.disputesHub()).addressOf(_disputeID);
    }

    function disputeOfFeature(uint _featureID) external view returns (uint) {
        return IDisputesHub(_iAS.disputesHub()).disputeOf(_featureID);
    }

    function lengthOfDisputes() external view returns (uint) {
        return Bindings.tokensLength(_iAS.disputesHub());
    }

    function datasOfDispute(
        uint _disputeID
    ) external view returns (DisputeDatas.Data memory) {
        return IDisputesDatasHub(_iAS.disputesDatasHub()).datasOf(_disputeID);
    }

    function arbitratorsOfDispute(
        uint _disputeID
    ) external view returns (uint[] memory) {
        return
            IDisputesDatasHub(_iAS.disputesDatasHub()).arbitratorsOf(
                _disputeID
            );
    }

    function timersOfDispute(
        uint _disputeID
    ) external view returns (DisputeTimes.Data memory _data) {
        return IDisputesDatasHub(_iAS.disputesDatasHub()).timersOf(_disputeID);
    }

    function rulesOfDispute(
        uint _disputeID
    ) external view returns (DisputeRules.Data memory _data) {
        return IDisputesDatasHub(_iAS.disputesDatasHub()).rulesOf(_disputeID);
    }

    function voteOfArbitrator(
        uint _disputeID,
        uint _arbitratorID
    ) external view returns (DisputeRules.Vote) {
        return
            IDisputesDatasHub(_iAS.disputesDatasHub()).voteOf(
                _disputeID,
                _arbitratorID
            );
    }

    function countersOfDispute(
        uint _disputeID
    ) external view returns (DisputeCounters.Data memory _data) {
        return
            IDisputesDatasHub(_iAS.disputesDatasHub()).countersOf(_disputeID);
    }

    function allowanceOfArbitrator(
        uint _disputeID,
        uint _arbitratorID
    ) external view returns (DisputeArbitrators.Status) {
        return
            IDisputesDatasHub(_iAS.disputesDatasHub()).allowanceOf(
                _disputeID,
                _arbitratorID
            );
    }

    // ---------------------------- //
    // ******** LAUNCHPAD ********* //
    // ******** --------- ********* //

    function addressOfLaunchpad(
        uint _launchpadID
    ) external view returns (address) {
        return ILaunchpadHub(_iAS.launchpadsHub()).addressOf(_launchpadID);
    }

    function launchpadsOfCV(uint _cvID) external view returns (uint[] memory) {
        return ILaunchpadHub(_iAS.launchpadsHub()).launchpadsOfCV(_cvID);
    }

    function lengthOfLaunchpads() external view returns (uint) {
        return Bindings.tokensLength(_iAS.launchpadsHub());
    }

    function datasOfLaunchpad(
        uint _launchpadID
    ) external view returns (DataTypes.LaunchpadData memory) {
        return
            ILaunchpadsDatasHub(_iAS.launchpadsDatasHub()).datasOf(
                _launchpadID
            );
    }

    function tierOfLaunchpad(
        uint _launchpadID,
        uint _tierID
    ) external view returns (DataTypes.TierData memory) {
        return
            ILaunchpadsDatasHub(_iAS.launchpadsDatasHub()).tierOf(
                _launchpadID,
                _tierID
            );
    }

    function datasOfInvestor(
        uint _launchpadID,
        address _investor
    ) external view returns (DataTypes.InvestorData memory) {
        return
            ILaunchpadsInvestorsHub(_iAS.launchpadsInvestorsHub()).datasOf(
                _launchpadID,
                _investor
            );
    }

    // ---------------------------- //
    // *********** PUBS *********** //
    // *********** ---- *********** //

    function lengthOfPubs() external view returns (uint) {
        return Bindings.tokensLength(_iAS.pubsHub());
    }

    function pubsOfCV(uint _cvID) external view returns (uint[] memory) {
        return IPubsHub(_iAS.pubsHub()).indexerOf(_cvID);
    }

    function answersOfPub(uint _pubID) external view returns (uint[] memory) {
        return IPubsDatasHub(_iAS.pubsDatasHub()).answersOfPub(_pubID);
    }

    function pubsOfMission(
        uint _missionID
    ) external view returns (uint[] memory) {
        return IPubsDatasHub(_iAS.pubsDatasHub()).pubsOfMission(_missionID);
    }

    // ---------------------------- //
    // *********** WORKS *********** //
    // *********** ---- *********** //

    function missionsOfCV(uint _cvID) external view returns (uint[] memory) {
        return IMissionsHub(_iAS.missionsHub()).indexerOf(_cvID);
    }

    function lengthOfMissions() external view returns (uint) {
        return Bindings.tokensLength(_iAS.missionsHub());
    }

    function datasOfMission(
        uint _missionID
    ) external view returns (DataTypes.MissionData memory) {
        return IMissionsHub(_iAS.missionsHub()).dataOf(_missionID);
    }

    function lengthOfFeatures() external view returns (uint) {
        return Bindings.tokensLength(_iAS.featuresHub());
    }

    function featuresOfCV(uint _cvID) external view returns (uint[] memory) {
        return IFeaturesHub(_iAS.featuresHub()).indexerOf(_cvID);
    }

    function datasOfFeature(
        uint _featureID
    ) external view returns (DataTypes.FeatureData memory) {
        return IFeaturesHub(_iAS.featuresHub()).dataOf(_featureID);
    }

    function datasOfWork(
        uint _featureID
    ) external view returns (DataTypes.FeatureInteractionData memory) {
        return
            ICollectWorkInteraction(_iAS.collectWorkInteraction()).dataOf(
                _featureID
            );
    }
}
