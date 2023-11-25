// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

import {DataTypes} from "../libraries/DataTypes.sol";
import {IAccessControl} from "../interfaces/system/IAccessControl.sol";
import {DisputeRules} from "../libraries/disputes/DisputeRules.sol";
import {DisputeDatas} from "../libraries/disputes/DisputeDatas.sol";
import {Bindings} from "../libraries/Bindings.sol";

import {IAPIGet} from "../interfaces/system/IAPIGet.sol";
import {IAPIPostPayable} from "../interfaces/system/IAPIPostPayable.sol";
import {IBalancesHub} from "../interfaces/system/IBalancesHub.sol";
import {IContract} from "../interfaces/system/IContract.sol";
import {IAddressSystem} from "../interfaces/system/IAddressSystem.sol";
import {ICVsHub} from "../interfaces/cv/ICVsHub.sol";
import {ICVsDatasHub} from "../interfaces/cv/ICVsDatasHub.sol";
import {IArbitratorsHub} from "../interfaces/escrow/IArbitratorsHub.sol";
import {IDispute} from "../interfaces/escrow/IDispute.sol";
import {IDisputesHub} from "../interfaces/escrow/IDisputesHub.sol";
import {IPubsHub} from "../interfaces/pubs/IPubsHub.sol";
import {IPubsDatasHub} from "../interfaces/pubs/IPubsDatasHub.sol";
import {IMissionsHub} from "../interfaces/works/IMissionsHub.sol";
import {ILaunchpadHub} from "../interfaces/launchpads/ILaunchpadHub.sol";
import {ILaunchpadsDatasHub} from "../interfaces/launchpads/ILaunchpadsDatasHub.sol";
import {ILaunchpad} from "../interfaces/launchpads/ILaunchpad.sol";
import {IFeaturesHub} from "../interfaces/works/IFeaturesHub.sol";
import {IToken} from "../interfaces/erc/IToken.sol";
import {ICollectWorkInteraction} from "../interfaces/works/ICollectWorkInteraction.sol";

contract APIPost is Ownable {
    using SafeMath for uint256;

    IAddressSystem private _iAS;
    IAPIGet private _iAPIGet;
    IBalancesHub private _iBalancesHub;

    address private _cvsHub;

    address private _cvsDatasHub;
    address private _collectWorkInteraction;
    address private _featuresHub;
    address private _missionsHub;
    address private _pubsHub;
    address private _pubsDatasHub;
    address private _disputesHub;
    address private _launchpadsHub;

    modifier onlyCVOwner() {
        require(_cvOf(msg.sender) > 0, "Must have CV");
        _;
    }

    modifier onlySatteliteContracts() {
        require(
            _disputesHub == msg.sender ||
                _featuresHub == msg.sender ||
                _launchpadsHub == msg.sender,
            "Only callable by our contracts"
        );
        _;
    }

    modifier onlyOwnerOf(
        uint _id,
        address _owner,
        address _contract
    ) {
        require(Bindings.ownerOf(_id, _contract) == _owner, "Not the owner");
        _;
    }

    constructor(address _addressSystem) {
        _iAS = IAddressSystem(_addressSystem);
        _iAS.setApiPost();
        require(
            _iAS.apiPost() == address(this),
            "APIPost : Address system failure"
        );
        _iAPIGet = IAPIGet(_iAS.apiGet());
        _cvsHub = _iAS.cvsHub();
        _cvsDatasHub = _iAS.cvsDatasHub();
        _collectWorkInteraction = _iAS.collectWorkInteraction();
        _featuresHub = _iAS.featuresHub();
        _missionsHub = _iAS.missionsHub();
        _launchpadsHub = _iAS.launchpadsHub();
        _pubsHub = _iAS.pubsHub();
        _pubsDatasHub = _iAS.pubsDatasHub();
        _disputesHub = _iAS.disputesHub();
        _iBalancesHub = IBalancesHub(_iAS.balancesHub());
        require(
            address(_iAPIGet) != address(0) &&
                _cvsHub != address(0) &&
                _cvsDatasHub != address(0) &&
                _launchpadsHub != address(0) &&
                _pubsHub != address(0) &&
                _pubsDatasHub != address(0) &&
                _collectWorkInteraction != address(0) &&
                _missionsHub != address(0) &&
                address(_iBalancesHub) != address(0) &&
                _featuresHub != address(0),
            "APIPost : Deployment failed"
        );
    }

    function setTokenURIOf(
        uint _tokenID,
        string calldata _tokenURI,
        address _ercContract
    ) external {
        IContract(_ercContract).setTokenURI(msg.sender, _tokenID, _tokenURI);
    }

    // ************* --- ************* //
    // ************* CVs ************* //
    // ************* --- ************* //

    function changeAcceptToken() external {
        ICVsHub(_cvsHub).setAcceptToken(_cvOf(msg.sender));
    }

    /**
     * @notice Binding for create a CV.
     * Each address could create only one cv
     * @param _tokenURI is for pinataCRUD by exemple
     * @dev this function trigger CVsHub contract
     */

    function createCV(string calldata _tokenURI) external {
        ICVsHub(_cvsHub).mint(msg.sender, _tokenURI);
    }

    // ************* -------- ************* //
    // ************* Missions ************* //
    // ************* -------- ************* //

    function createMission(string calldata _tokenURI) external onlyCVOwner {
        uint missionPrice = _iBalancesHub.missionPrice();
        IToken _iToken = IToken(_iAS.token());
        uint tokenPrice = _iToken.price();

        bool success = _iToken.paid(
            msg.sender,
            owner(),
            missionPrice * tokenPrice
        ); // ! Refaire les calculs
        require(success, "Error paid mission");
        _createMission(_tokenURI, 0);
    }

    /**
     * @notice Binding for create mission, it's payable.
     * @param _tokenURI is for pinataCRUD by exemple
     * @dev this function trigger MissionsHub & BalancesHub contract
     * msg.sender == ownerOfCV(x)
     * msg.value == BalancesHub.missionPrice
     */

    function createMissionLaunchpad(
        uint _launchpadID,
        string calldata _tokenURI
    ) external onlyCVOwner {
        address _launchpadAddr = _launchpadAddr(_launchpadID);
        uint missionPrice = _iBalancesHub.missionPrice();
        IToken _iToken = IToken(_iAS.token());
        uint tokenPrice = _iToken.price();
        require(
            Bindings.ownerOf(_launchpadID, _launchpadsHub) == msg.sender &&
                _iAPIGet.statusOfLaunchpad(_launchpadID) ==
                DataTypes.LaunchpadStatus.Closed &&
                _iToken.balanceOf(_launchpadAddr) * tokenPrice > missionPrice,
            "APIPost: Error create mission"
        );
        _iToken.transferFrom(
            _launchpadAddr,
            owner(),
            missionPrice * tokenPrice
        );
        _createMission(_tokenURI, _launchpadID);
    }

    function _createMission(
        string calldata _tokenURI,
        uint _launchpadID
    ) internal {
        IMissionsHub(_missionsHub).mint(msg.sender, _tokenURI, _launchpadID);
    }

    /**
     * @notice Binding for close mission
     * @param _missionID is for id of mission to close. It's must be an owned mission
     * @dev this function trigger MissionsHub contract
     * msg.sender == ownerOfCV(x) && ownerOfMission(_missionID)
     */

    function closeMission(
        uint _missionID
    ) external onlyCVOwner onlyOwnerOf(_missionID, msg.sender, _missionsHub) {
        IMissionsHub(_missionsHub).closeMission(_missionID);
    }

    // function followMission(uint _IDToFollow) external onlyCVOwner {}

    // function unfollowMission(uint _IDToUnfollow) external onlyCVOwner {}

    // ************* -------- ************* //
    // ************* Features ************* //
    // ************* -------- ************* //

    function createFeatureLaunchpad(
        uint256 _value,
        uint _missionID,
        uint16 _estimatedDays,
        bool _isInviteOnly,
        string calldata _tokenURI,
        DataTypes.CourtIDs _specification
    ) external onlyOwnerOf(_missionID, msg.sender, _missionsHub) {
        uint launchpadID = _iAPIGet.datasOfMission(_missionID).launchpad;

        IToken _iToken = IToken(_iAS.token());
        require(
            launchpadID > 0 &&
                Bindings.ownerOf(launchpadID, _launchpadsHub) == msg.sender &&
                _iToken.balanceOf(_launchpadAddr(launchpadID)) >= _value &&
                _iAPIGet.statusOfLaunchpad(launchpadID) ==
                DataTypes.LaunchpadStatus.Closed,
            "APIPost: Error create feature"
        );
        uint value = _value;
        bool success = _iToken.transferFrom(
            _launchpadAddr(launchpadID),
            owner(),
            value
        );
        require(success, "Error transfer");
        _createFeature(
            _value,
            _missionID,
            _estimatedDays,
            _isInviteOnly,
            _tokenURI,
            _specification
        );
    }

    /**
     * @notice creation feature on this contract it's payable with erc20 token
     * @notice use apiPostPayable contract if you want to pay with ethereum
     */
    function createFeature(
        uint256 _value,
        uint _missionID,
        uint16 _estimatedDays,
        bool _isInviteOnly,
        string calldata _tokenURI,
        DataTypes.CourtIDs _specification
    ) external onlyOwnerOf(_missionID, msg.sender, _missionsHub) {
        bool success = IToken(_iAS.token()).paid(
            msg.sender,
            address(this),
            _value
        );
        _createFeature(
            _value,
            _missionID,
            _estimatedDays,
            _isInviteOnly,
            _tokenURI,
            _specification
        );
    }

    function _createFeature(
        uint _value,
        uint _missionID,
        uint16 _estimatedDays,
        bool _isInviteOnly,
        string calldata _tokenURI,
        DataTypes.CourtIDs _specification
    ) internal {
        uint wadge = _value;
        require(wadge > 0, "Insuficient value");
        uint newFeature = IFeaturesHub(_featuresHub).mint(
            msg.sender,
            _missionID,
            wadge,
            _estimatedDays,
            _isInviteOnly,
            _tokenURI,
            _specification,
            true
        );

        require(newFeature > 0, "Error creation feature");
    }

    /**
     * @notice Binding for valid feature
     * @param _featureID is for id of feature. It's must be an owned feature || worked feature
     * @dev this function trigger FeaturesHub && ArbitratorsHub && BalancesHub contracts
     * msg.sender == ownerOfCV(x) && ownerOfFeature(_featureID) || workerOfFeature
     * La fonction envoie le salaire au worker
     */

    function validFeature(uint _featureID) external onlyCVOwner {
        IFeaturesHub(_featuresHub).validFeature(msg.sender, _featureID);
    }

    /**
     * @notice Binding for invite worker on feature -- onlyOwner
     * @param _featureID is for id of feature
     * @param _cvWorkerID is for id of cv worker -- notOwner
     * @dev this function trigger FeaturesHub && CollectWorkInteraction contracts
     * msg.sender == ownerOfCV(x) && ownerOfFeature(_featureID)
     * La fonction envoie le salaire au worker
     */

    function inviteWorker(
        uint _cvWorkerID,
        uint _featureID
    ) external onlyOwnerOf(_featureID, msg.sender, _featuresHub) {
        bool payWithToken = IFeaturesHub(_featuresHub)
            .dataOf(_featureID)
            .payWithToken;
        bool acceptToken = ICVsHub(_cvsHub).isAcceptToken(_cvWorkerID);
        require(
            !payWithToken || (payWithToken && acceptToken),
            "Worker doesn't accept token"
        );
        ICollectWorkInteraction(_collectWorkInteraction).inviteWorker(
            _cvOf(msg.sender),
            _cvWorkerID,
            _featureID
        );
    }

    /**
     * @notice Binding for accept job of feature -- notOwner
     * @param _featureID is for id of feature -- notOwner
     * @dev this function trigger FeaturesHub && CollectWorkInteraction contracts
     * msg.sender == ownerOfCV(x) && !ownerOfFeature(_featureID)
     * La fonction assigne un nouveau worker, elle ne peut être appelé que si le sender y a été invité
     */

    function acceptJob(uint _featureID) external {
        ICollectWorkInteraction(_collectWorkInteraction).acceptJob(
            _cvOf(msg.sender),
            _featureID
        );
    }

    /**
     * @notice Binding for decline job proposition of feature -- onlyInvited
     * @param _featureID is for id of feature -- onlyInvited
     * @dev this function trigger FeaturesHub && CollectWorkInteraction contracts
     * msg.sender == ownerOfCV(x) && invitedOnFeature(_featureID)
     * Permet de refuser les offres qui ont été proposé, elle ne peut être appelé que si le sender y a été invité
     */

    function declineJob(uint _featureID) external {
        ICollectWorkInteraction(_collectWorkInteraction).declineJob(
            _cvOf(msg.sender),
            _featureID
        );
    }

    /**
     * @notice Binding for ask to join feature -- notOwner
     * @param _featureID is for id of feature
     * @dev this function trigger CollectWorkInteraction contract
     * msg.sender == ownerOfCV(x) && !ownerOfFeature(_featureID)
     * Permet de proposé ces services pour une feature. L'owner devra ensuite signer pour assigner le worker
     */

    function askToJoin(uint _featureID) external {
        ICollectWorkInteraction(_collectWorkInteraction).askToJoin(
            _cvOf(msg.sender),
            _featureID
        );
    }

    /**
     * @notice Binding for signWorker join feature -- onlyOwnerOfFeature
     * @param _featureID is for id of feature -- onlyOwner
     * @param _cvWorkerID is for id of feature -- onlyIfAskJoin
     * @dev this function trigger CollectWorkInteraction && FeaturesHub contracts
     * msg.sender == ownerOfCV(x) && ownerOfFeature(_featureID)
     * Permet de signer un worker pour une feature.
     * Fonctionne seulement si le worker a demandé à rejoindre
     */

    function signWorker(
        uint _featureID,
        uint _cvWorkerID
    ) external onlyCVOwner onlyOwnerOf(_featureID, msg.sender, _featuresHub) {
        ICollectWorkInteraction(_collectWorkInteraction).signWorker(
            _featureID,
            _cvWorkerID
        );
    }

    /**
     * @notice Binding for improve feature & change estimatedDay for have a new timing -- onlyOwnerOrWorker
     * @param _featureID is for id of feature
     * @param _estimatedDays is for estimated time for worker to finish job
     * @dev this function trigger CollectWorkInteraction  && FeaturesHub contracts
     * msg.sender == ownerOfCV(x) && workerOrOwner
     * Should update time where worker could claim his wadge.
     * Works only if feature wasn't validated
     */
    function improveFeature(
        uint _featureID,
        uint16 _estimatedDays
    ) external onlyCVOwner onlyOwnerOf(_featureID, msg.sender, _featuresHub) {
        ICollectWorkInteraction(_collectWorkInteraction).improveFeature(
            _featureID,
            _estimatedDays
        );
    }

    /**
     * @notice Binding for contest  feature -- onlyOwnerOrWorker
     * @param _featureID is for id of feature
     * @param _reclamationPeriod is for time for arbitrator to judge case
     * @param _nbArbitrators is number of arbitrators to judge case
     * @param _tokenURI is for pinataCRUD by exemple
     * @dev this function trigger CollectWorkInteraction && DisputesHub && FeaturesHub contracts
     * msg.sender == ownerOfCV(x) && workerOrOwner
     * Permet de déclencher le protocole de résolution des conflits.
     * Fonctionne seulement si la feature n'a pas été validé
     */

    function contestFeature(
        uint _featureID,
        uint32 _reclamationPeriod,
        uint8 _nbArbitrators,
        string calldata _tokenURI
    ) external {
        ICollectWorkInteraction(_collectWorkInteraction).contestFeature(
            _cvOf(msg.sender),
            _featureID,
            _reclamationPeriod,
            _nbArbitrators,
            _tokenURI
        );
    }

    // ************* ---- ************* //
    // ************* Pubs ************* //
    // ************* ---- ************* //

    function createPayablePub(
        string calldata _tokenURI,
        uint _amount,
        string calldata _tokenURIPayable
    ) external {
        require(
            bytes(_tokenURI).length > 3 &&
                bytes(_tokenURIPayable).length > 3 &&
                _amount > 0,
            "Error value pub"
        );
        uint newPubID = _createPub(_cvOf(msg.sender), _tokenURI, true);
        IPubsDatasHub(_iAS.pubsDatasHub()).mintPayablePub(
            newPubID,
            _amount,
            _tokenURIPayable
        );
    }

    // ! TO remove ? Can be db

    function createPub(string calldata _tokenURI) external {
        _createPub(_cvOf(msg.sender), _tokenURI, false);
    }

    function _createPub(
        uint _cvID,
        string calldata _tokenURI,
        bool _isPayable
    ) internal returns (uint) {
        return IPubsHub(_pubsHub).mint(_cvID, _tokenURI, _isPayable);
    }

    // ************* ------- ************* //
    // ************* Dispute ************* //
    // ************* ------- ************* //

    /**
     * @notice Binding for accept arbitration of dispute -- workerOrOwner
     * @param _disputeID must to be an existed ID -- onlyInvited
     * @dev this function trigger DisputesDatasHub && Dispute && ArbitratorsHub contracts
     * msg.sender == ownerOfCV(x) && arbitratorOnCourt(dispute.courtID)
     * Doit être trigger par le worker ou l'owner pour démarrer le workflow
     */
    function initDispute(uint _disputeID) external {
        IDispute(_disputeAddr(_disputeID)).init(_cvOf(msg.sender));
    }

    /**
     * @notice Binding for accept arbitration of dispute -- notOwner && worker&arbitrator
     * @param _disputeID must to be an existed ID -- onlyInvited
     * @dev this function trigger DisputesDatasHub && Dispute && ArbitratorsHub contracts
     * msg.sender == ownerOfCV(x) && arbitratorOnCourt(dispute.courtID)
     * Permet d'accepté d'arbitrer une dispute lorsque l'on est invité
     */
    function acceptArbitration(uint _disputeID) external {
        bool success = IDispute(_disputeAddr(_disputeID)).acceptArbitration(
            _cvOf(msg.sender)
        );
        require(success, "Error accept arbitration");
        IArbitratorsHub(_iAS.arbitratorsHub()).acceptArbitration(
            _cvOf(msg.sender),
            _iAPIGet.datasOfDispute(_disputeID).courtID,
            _disputeID
        );
    }

    /**
     * @notice Binding for refuse arbitration of dispute -- notOwner && worker&arbitrator
     * @param _disputeID must to be an existed ID -- onlyInvited
     * @dev this function trigger DisputesDatasHub && Dispute && ArbitratorsHub contracts
     * msg.sender == ownerOfCV(x) && arbitratorOnCourt(dispute.courtID)
     * Permet de refuser l'invitation à arbitrer une dispute lorsque l'on y est invité
     */
    function refuseArbitration(uint _disputeID) external {
        IDispute(_disputeAddr(_disputeID)).refuseArbitration(_cvOf(msg.sender));
    }

    /**
     * @notice Binding for started vote period -- onlyOwnerOrWorker
     * @param _disputeID must to be an existed ID
     * @dev this function trigger DisputesDatasHub && Dispute contracts
     * msg.sender == ownerOfCV(x) && ownerOrWorker(featureID)
     * Permet de changer le workflow pour pouvoir démarrer le lancement des votes
     */
    function startedVotePeriod(uint _disputeID) external {
        IDispute(_disputeAddr(_disputeID)).startedVotePeriod(_cvOf(msg.sender));
    }

    /**
     * @notice Binding for vote -- onlyArbitrator
     * @param _disputeID must to be an existed ID
     * @param _vote must not be Waiting (0)
     * @dev this function trigger DisputesDatasHub && Dispute && ArbitratorsHub contracts
     * msg.sender == ownerOfCV(x) && arbitratorOf(disputeID)
     * Permet à un arbitrator de voter pour une décision
     */

    function vote(uint _disputeID, DisputeRules.Vote _vote) external {
        IDispute(_disputeAddr(_disputeID)).vote(_cvOf(msg.sender), _vote);
        DisputeRules.Data memory _rulesDispute = _iAPIGet.rulesOfDispute(
            _disputeID
        );

        DataTypes.FeatureData memory _datas = _iAPIGet.datasOfFeature(
            _iAPIGet.datasOfDispute(_disputeID).featureID
        );
        IToken _iToken = IToken(_iAS.token());
        uint amount;
        if (_datas.payWithToken) {
            if (!_rulesDispute.appeal) {
                amount = _datas.wadge.div(2);
            } else {
                amount = _datas.wadge.div(3);
            }
        } else {
            if (!_rulesDispute.appeal) {
                amount = _datas.wadge.div(2).div(_iToken.price());
            } else {
                amount = _datas.wadge.div(3).div(_iToken.price());
            }
        }
        _iToken.mint(msg.sender, amount);
    }

    /**
     * @notice Binding for appeal -- onlyWorkerOrOwner
     * @param _disputeID must to be an existed ID
     * @dev this function trigger DisputesDatasHub && Dispute && ArbitratorsHub contracts
     * msg.sender == ownerOfCV(x) && workerOrOwner(featureID)
     * Permet au worker ou à l'owner de la feature de faire appel de la décision
     */
    function appeal(uint _disputeID) external {
        IDispute(_disputeAddr(_disputeID)).doAppeal(_cvOf(msg.sender));
    }

    /**
     * @notice Binding for resolved dispute -- onlyWorkerOrOwner
     * @param _disputeID must to be an existed ID
     * @dev this function trigger DisputesDatasHub && Dispute  contracts
     * msg.sender == ownerOfCV(x) && workerOrOwner(featureID)
     * Permet au worker ou à l'owner de la feature de résoudre la dispute.
     * Elle ne peut être appelé que selon un workflow précis
     */
    function resolvedDispute(uint _disputeID) external {
        IDispute(_disputeAddr(_disputeID)).resolvedDispute(_cvOf(msg.sender));
    }

    // ************* --------- ************* //
    // ************* Launchpad ************* //
    // ************* --------- ************* //

    function _cvOf(address _for) internal view returns (uint) {
        return _iAPIGet.cvOf(_for);
    }

    function _launchpadAddr(uint _launchpadID) internal view returns (address) {
        return _iAPIGet.addressOfLaunchpad(_launchpadID);
    }

    function _disputeAddr(uint _disputeID) internal view returns (address) {
        return _iAPIGet.addressOfDispute(_disputeID);
    }
}
