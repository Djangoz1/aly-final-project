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
import {IToken} from "../interfaces/erc/IToken.sol";

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

    address public addressSystem;

    constructor(address _addressSystem) {
        _iAS = IAddressSystem(_addressSystem);
        _iAS.setApiGet();
        addressSystem = _addressSystem;
        require(_iAS.apiGet() == address(this), "APIGet: Error deployment");
        // _iAS.setApiGet();
    }

    // ---------------------------- //
    // ************ GENERAL ************ //
    // ************ -- ************ //

    function staked(uint _cvID) external view returns (uint) {
        return
            IToken(_iAS.token()).staked(Bindings.ownerOf(_cvID, _iAS.cvsHub()));
    }

    function balanceOfToken(
        uint _cvID,
        address _ercAddr
    ) external view returns (uint) {
        address _owner = Bindings.ownerOf(_cvID, _iAS.cvsHub());
        return Bindings.balanceOf(_owner, _ercAddr);
    }

    function ownerOfToken(
        uint _tokenID,
        address _ercAddr
    ) external view returns (address) {
        return Bindings.ownerOf(_tokenID, _ercAddr);
    }

    function indexerOfToken(
        uint _tokenID,
        address _contract
    ) external view returns (uint[] memory) {
        return Bindings.indexerOf(_tokenID, _contract);
    }

    function tokenURIOf(
        uint _tokenID,
        address _ercAddr
    ) external view returns (string memory) {
        return Bindings.tokenURI(_tokenID, _ercAddr);
    }

    function tokensLengthOf(address _ercAddr) external view returns (uint) {
        return Bindings.tokensLength(_ercAddr);
    }

    // ---------------------------- //
    // ************ CV ************ //
    // ************ -- ************ //

    function cvOf(address _for) external view returns (uint) {
        return _cvOf(_for);
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

    function indexerOfCourt(
        DataTypes.CourtIDs _courtID
    ) external view returns (uint[] memory) {
        return IArbitratorsHub(_iAS.arbitratorsHub()).indexerOf(_courtID);
    }

    function lengthOfCourt(
        DataTypes.CourtIDs _courtID
    ) external view returns (uint) {
        return IArbitratorsHub(_iAS.arbitratorsHub()).lengthOfCourt(_courtID);
    }

    function arbitrationOfCV(
        uint _cvID,
        DataTypes.CourtIDs _courtID
    ) external view returns (uint256) {
        return
            IArbitratorsHub(_iAS.arbitratorsHub()).arbitrationOfCV(
                _cvID,
                _courtID
            );
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

    //! TO replace on datasFeature
    function disputeOfFeature(uint _featureID) external view returns (uint) {
        return IDisputesHub(_iAS.disputesHub()).disputeOf(_featureID);
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
        return _launchpadsHub().addressOf(_launchpadID);
    }

    function launchpadsOfCV(uint _cvID) external view returns (uint[] memory) {
        return _launchpadsHub().launchpadsOfCV(_cvID);
    }

    function datasOfLaunchpad(
        uint _launchpadID
    ) external view returns (DataTypes.LaunchpadData memory) {
        return
            ILaunchpadsDatasHub(_iAS.launchpadsDatasHub()).datasOf(
                _launchpadID
            );
    }

    // function currentTierIDOf(uint _launchpadID) external view returns (uint8) {
    //     return
    //         ILaunchpad(_launchpadsHub().addressOf(_launchpadID))
    //             .getCurrentTierID();
    // }

    // function tierOfLaunchpad(
    //     uint _launchpadID,
    //     uint _tierID
    // ) external view returns (DataTypes.TierData memory) {
    //     return
    //         ILaunchpadsDatasHub(_iAS.launchpadsDatasHub()).tierOf(
    //             _launchpadID,
    //             _tierID
    //         );
    // }

    function statusOfLaunchpad(
        uint _launchpadID
    ) external view returns (DataTypes.LaunchpadStatus) {
        return ILaunchpad(_launchpadsHub().addressOf(_launchpadID)).status();
    }

    function datasOfInvestor(
        uint _launchpadID,
        uint _cvID
    ) external view returns (DataTypes.InvestorData memory) {
        return
            ILaunchpadsInvestorsHub(_iAS.launchpadsInvestorsHub()).datasOf(
                _launchpadID,
                _cvID
            );
    }

    // ---------------------------- //
    // *********** PUBS *********** //
    // *********** ---- *********** //

    function datasOfPayablePub(
        uint _pubID
    ) external view returns (DataTypes.PubPayableData memory) {
        IPubsDatasHub iPDH = _pubsDatasHub();
        DataTypes.PubPayableData memory datas = iPDH.datasOfPayablePub(_pubID);
        require(datas.amount > 0, "Not payable pub");
        if (Bindings.ownerOf(_pubID, _iAS.pubsHub()) == msg.sender) {
            datas.isAllowed = true;
        } else {
            datas.isAllowed = iPDH.isAllowed(_cvOf(msg.sender), _pubID);
        }
        if (!datas.isAllowed) {
            datas.tokenURI = "";
        }

        return datas;
    }

    function pubsPayableOf(uint _cvID) external view returns (uint[] memory) {
        return IPubsHub(_iAS.pubsHub()).indexerPayableOf(_cvID);
    }

    function answersOfPub(uint _pubID) external view returns (uint[] memory) {
        return _pubsDatasHub().answersOfPub(_pubID);
    }

    function datasOfLike(
        uint _likeID
    ) external view returns (DataTypes.LikeData memory) {
        return _pubsDatasHub().dataOf(_likeID);
    }

    function datasOfPub(
        uint _pubID
    ) external view returns (DataTypes.PubData memory) {
        return _pubsDatasHub().dataOfPub(_pubID);
    }

    function pubsOfMission(
        uint _missionID
    ) external view returns (uint[] memory) {
        return _pubsDatasHub().pubsOfMission(_missionID);
    }

    // ---------------------------- //
    // *********** WORKS *********** //
    // *********** ---- *********** //

    function missionsOfLaunchpad(
        uint _launchpadID
    ) external view returns (uint[] memory) {
        return
            IMissionsHub(_iAS.missionsHub()).indexerOfLaunchpad(_launchpadID);
    }

    function jobsOfCV(uint _cvID) external view returns (uint[] memory) {
        return
            ICollectWorkInteraction(_iAS.collectWorkInteraction()).jobsOf(
                _cvID
            );
    }

    function invitesOfCV(uint _cvID) external view returns (uint[] memory) {
        return
            ICollectWorkInteraction(_iAS.collectWorkInteraction()).invitesOf(
                _cvID
            );
    }

    function datasOfMission(
        uint _missionID
    ) external view returns (DataTypes.MissionData memory) {
        return IMissionsHub(_iAS.missionsHub()).dataOf(_missionID);
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

    function _cvOf(address _for) internal view returns (uint) {
        return Bindings.cvOf(_for, _iAS.cvsHub());
    }

    function _pubsDatasHub() internal view returns (IPubsDatasHub) {
        return IPubsDatasHub(_iAS.pubsDatasHub());
    }

    function _launchpadsHub() internal view returns (ILaunchpadHub) {
        return ILaunchpadHub(_iAS.launchpadsHub());
    }
}
