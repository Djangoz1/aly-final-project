// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import {DataTypes} from "./libraries/DataTypes.sol";
import {IAccessControl} from "./interfaces/IAccessControl.sol";
import {DisputeRules} from "./libraries/disputes/DisputeRules.sol";
import {Bindings} from "./libraries/Bindings.sol";

import {IArbitratorsHub} from "./interfaces/IArbitratorsHub.sol";
import {ICVHub} from "./interfaces/ICVHub.sol";
import {IDispute} from "./interfaces/IDispute.sol";
import {IPubsHub} from "./interfaces/IPubsHub.sol";
import {IDisputesHub} from "./interfaces/IDisputesHub.sol";
import {IBalancesHub} from "./interfaces/IBalancesHub.sol";
import {ICollectPubs} from "./interfaces/ICollectPubs.sol";
import {IMissionsHub} from "./interfaces/IMissionsHub.sol";
import {ILaunchpadHub} from "./interfaces/ILaunchpadHub.sol";
import {ILaunchpad} from "./interfaces/ILaunchpad.sol";
import {IAddressHub} from "./interfaces/IAddressHub.sol";
import {IFeaturesHub} from "./interfaces/IFeaturesHub.sol";
import {ICollectWorkInteraction} from "./interfaces/ICollectWorkInteraction.sol";
import {ICollectFollowCv} from "./interfaces/ICollectFollowCv.sol";

contract APIPost {
    // Ajoutez votre code ici

    IAddressHub _iAH;
    address private _cvHub;
    address private _collectWorkInteraction;
    address private _featuresHub;
    address private _missionsHub;
    address private _pubsHub;
    address private _disputesHub;

    modifier onlyCVOwner() {
        require(ICVHub(_cvHub).getCV(msg.sender) > 0, "Must have CV");
        _;
    }

    modifier onlySatteliteContracts() {
        require(
            _disputesHub == msg.sender ||
                _featuresHub == msg.sender ||
                _iAH.launchpadsHub() == msg.sender,
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

    constructor(address _addressHub) {
        _iAH = IAddressHub(_addressHub);
        _cvHub = _iAH.cvHub();
        _collectWorkInteraction = _iAH.collectWorkInteraction();
        _featuresHub = _iAH.featuresHub();
        _missionsHub = _iAH.missionsHub();
        _pubsHub = _iAH.pubsHub();
        _disputesHub = _iAH.disputesHub();
        require(_cvHub != address(0), "APIPost : Must deploy cvHub first");
        require(
            _missionsHub != address(0),
            "APIPost : Must deploy missionsHub first"
        );
        require(
            _featuresHub != address(0),
            "APIPost : Must deploy featuresHub first"
        );
        require(
            _collectWorkInteraction != address(0),
            "APIPost : Must deploy collectWorkInteraction first"
        );
        require(_pubsHub != address(0), "APIPost : Must deploy pubsHub first");
        _iAH.setApiPost();
    }

    function sendTransaction(
        address _to,
        uint _value
    ) external payable onlySatteliteContracts returns (bool) {
        // Transférer les ETH à l'adresse spécifiée
        require(_to != address(0), "0 address");
        require(_value > 0, "Erorr value");
        (bool success, ) = _to.call{value: _value}("");
        require(success, "apiPost : Transaction failed");
        return true;
    }

    // ************* --- ************* //
    // ************* CVs ************* //
    // ************* --- ************* //

    /**
     * @notice Binding for create a CV.
     * Each address could create only one cv
     * @param _tokenURI is for pinataCRUD by exemple
     * @dev this function trigger cvHub contract
     */

    function createCV(string calldata _tokenURI) external {
        ICVHub(_cvHub).mint(msg.sender, _tokenURI);
    }

    /**
     * @notice Binding for follow cv.
     * Must have a cv for sender address & can't follow own cv.
     * @param _cvToFollow is cv ID want follow
     * @dev this function trigger CollectFollowCv contract
     */

    function followCV(uint _cvToFollow) external {
        uint cvFollower = _getCV(msg.sender);
        require(_cvToFollow != cvFollower, "Can't follow yourself");
        require(
            Bindings.ownerOf(_cvToFollow, _cvHub) != address(0),
            "ERC721: invalid token ID"
        );
        ICollectFollowCv(_iAH.collectFollowCV()).follow(
            cvFollower,
            _cvToFollow
        );
    }

    /**
     * @notice Binding for unfollow cv.
     * Must have a cv for sender address & can't unfollow own cv & not followed cv.
     * @param _cvToUnfollow is cv ID want unfollow
     * @dev this function trigger CollectFollowCv contract
     */

    function unfollowCV(uint _cvToUnfollow) external {
        uint cvFollower = _getCV(msg.sender);
        require(_cvToUnfollow != cvFollower, "Can't unfollow yourself");
        require(
            Bindings.ownerOf(_cvToUnfollow, _cvHub) != address(0),
            "ERC721: invalid token ID"
        );
        ICollectFollowCv(_iAH.collectFollowCV()).unfollow(
            cvFollower,
            _cvToUnfollow
        );
    }

    // ************* -------- ************* //
    // ************* Missions ************* //
    // ************* -------- ************* //

    /**
     * @notice Binding for create mission, it's payable.
     * @param _tokenURI is for pinataCRUD by exemple
     * @dev this function trigger MissionsHub & BalancesHub contract
     * msg.sender == ownerOfCV(x)
     * msg.value == BalancesHub.missionPrice
     */

    function createMission(
        string calldata _tokenURI
    ) external payable onlyCVOwner {
        uint missionPrice = IBalancesHub(_iAH.balancesHub()).missionPrice();
        require(msg.value == missionPrice, "Mission price : Invalid value");
        IMissionsHub(_missionsHub).mint(msg.sender, _tokenURI);
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

    function followMission(uint _IDToFollow) external onlyCVOwner {}

    function unfollowMission(uint _IDToUnfollow) external onlyCVOwner {}

    // ************* -------- ************* //
    // ************* Features ************* //
    // ************* -------- ************* //

    /**
     * @notice Binding for create feature
     * @param _missionID is for id of mission linked to feature. It's must be an owned mission
     * @param _estimatedDays when _estimatedDays + startedAt == block.timestamp worker can claim his wadge
     * @param _isInviteOnly is a boolean if == true > workers can askTojoin if  == false can't
     * @param _tokenURI is for pinataCRUD by exemple
     * @param _specification is specification of feature. Si un litige a lieu alors il sera jugé par la court spécialisé. Si il n'a pas lieu le worker intègreras la court
     * @dev this function trigger MissionsHub && CollectWorkInteraction && MissionsHub contracts
     * msg.sender == ownerOfCV(x) && ownerOfMission(_missionID)
     * msg.value > 0
     */

    function createFeature(
        uint _missionID,
        uint16 _estimatedDays,
        bool _isInviteOnly,
        string calldata _tokenURI,
        DataTypes.CourtIDs _specification
    )
        external
        payable
        onlyCVOwner
        onlyOwnerOf(_missionID, msg.sender, _missionsHub)
    {
        uint wadge = msg.value;
        require(wadge > 0, "Insuficient value");
        uint newFeature = IFeaturesHub(_featuresHub).mint(
            msg.sender,
            _missionID,
            wadge,
            _estimatedDays,
            _isInviteOnly,
            _tokenURI,
            _specification
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
        ICollectWorkInteraction(_collectWorkInteraction).inviteWorker(
            _getCV(msg.sender),
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
            _getCV(msg.sender),
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
            _getCV(msg.sender),
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
            _getCV(msg.sender),
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
            _getCV(msg.sender),
            _featureID,
            _reclamationPeriod,
            _nbArbitrators,
            _tokenURI
        );
    }

    // ************* ---- ************* //
    // ************* Pubs ************* //
    // ************* ---- ************* //

    /**
     * @notice Binding for create pub
     * @param _tokenURI is for pinataCRUD by exemple
     * @dev this function trigger PubsHub contract
     * msg.sender == ownerOfCV(x)
     * Permet de poster une publication
     */

    function createPub(string calldata _tokenURI) external {
        _createPub(_getCV(msg.sender), _tokenURI);
    }

    function _createPub(
        uint _cvID,
        string calldata _tokenURI
    ) internal returns (uint) {
        return IPubsHub(_pubsHub).mint(_cvID, _tokenURI);
    }

    /**
     * @notice Binding for create pub answer
     * @param _pubID must to be an existed ID
     * @param _tokenURI is for pinataCRUD by exemple
     * @dev this function trigger PubsHub && CollectPubs contracts
     * msg.sender == ownerOfCV(x)
     * Permet de poster une réponse à une publication
     */
    function createPubAnswer(uint _pubID, string calldata _tokenURI) external {
        require(_pubID <= Bindings.tokensLength(_pubsHub), "Pub not exist");
        uint newPubID = _createPub(_getCV(msg.sender), _tokenURI);
        require(newPubID != 0, "Error create pub");
        ICollectPubs(_iAH.collectPubs()).addPubAnswer(
            newPubID,
            _pubID,
            _tokenURI
        );
    }

    /**
     * @notice Binding for create pub Mission
     * @param _missionID must to be an existed ID
     * @param _tokenURI is for pinataCRUD by exemple
     * @dev this function trigger PubsHub && CollectPubs && MissionsHub contracts
     * msg.sender == ownerOfCV(x)
     * Permet de poster une publication sur le mur d'une mission
     */
    function createPubMission(
        uint _missionID,
        string calldata _tokenURI
    ) external {
        require(
            _missionID <= Bindings.tokensLength(_missionsHub),
            "Mission not exist"
        );
        uint newPubID = _createPub(_getCV(msg.sender), _tokenURI);
        ICollectPubs(_iAH.collectPubs()).addPubMission(
            newPubID,
            _missionID,
            _tokenURI
        );
    }

    /**
     * @notice Binding for like pub
     * @param _pubID must to be an existed ID -- notLikedPub
     * @dev this function trigger PubsHub && CollectLikePubs contracts
     * msg.sender == ownerOfCV(x)
     * Permet de liké une publication
     */
    function likePub(uint _pubID) external {
        IPubsHub(_pubsHub).likePub(_getCV(msg.sender), _pubID);
    }

    /**
     * @notice Binding for unlike pub
     * @param _pubID must to be an existed ID -- onlyLikedPub
     * @dev this function trigger PubsHub && CollectLikePubs contracts
     * msg.sender == ownerOfCV(x)
     * Permet d'unliké une publication liké
     */
    function unlikePub(uint _pubID) external {
        IPubsHub(_pubsHub).unlikePub(_getCV(msg.sender), _pubID);
    }

    // ************* ---------- ************* //
    // ************* Arbitrator ************* //
    // ************* ---------- ************* //

    /**
     * @notice Binding for invest on court -- onlyArbitratorOnCourt(_courtID)
     * @param _courtID must to have a slot in court
     * @dev this function trigger ArbitratorsHub contract
     * msg.sender == ownerOfCV(x) && onlyArbitratorOnCourt(_courtID)
     * msg.value > 0
     * Permet d'investir dans une court pour avoir une chance supplémentaire d'être désigné en tant qu'arbitre pour un litige
     */
    function investOnCourt(DataTypes.CourtIDs _courtID) external payable {
        require(msg.value > 0, "Invalid value");
        IArbitratorsHub(_iAH.arbitratorsHub()).investOnCourt(
            _getCV(msg.sender),
            msg.value,
            _courtID
        );
    }

    /**
     * @notice Binding for withdraw on court -- onlyArbitratorOnCourt(_courtID)
     * @param _amount must to be <= balanceOnCourt
     * @param _courtID must to have a slot in court
     * @dev this function trigger ArbitratorsHub contract
     * msg.sender == ownerOfCV(x) && onlyArbitratorOnCourt(_courtID)
     * Permet de récupéré une somme investi dans une court.
     */
    function withdrawFromCourt(
        uint _amount,
        DataTypes.CourtIDs _courtID
    ) external {
        require(_amount > 0, "Invalid value");
        IArbitratorsHub(_iAH.arbitratorsHub()).withdrawFromCourt(
            _getCV(msg.sender),
            _amount,
            _courtID
        );
        payable(msg.sender).transfer(_amount);
    }

    // ************* ------- ************* //
    // ************* Dispute ************* //
    // ************* ------- ************* //

    /**
     * @notice Binding for accept arbitration of dispute -- workerOrOwner
     * @param _disputeID must to be an existed ID -- onlyInvited
     * @dev this function trigger EscrowDatasHub && Dispute && ArbitratorsHub contracts
     * msg.sender == ownerOfCV(x) && arbitratorOnCourt(dispute.courtID)
     * Doit être trigger par le worker ou l'owner pour démarrer le workflow
     */
    function initDispute(uint _disputeID) external {
        address _dispute = IDisputesHub(_disputesHub).addressOf(_disputeID);
        IDispute(_dispute).init(_getCV(msg.sender));
    }

    /**
     * @notice Binding for accept arbitration of dispute -- notOwner && worker&arbitrator
     * @param _disputeID must to be an existed ID -- onlyInvited
     * @dev this function trigger EscrowDatasHub && Dispute && ArbitratorsHub contracts
     * msg.sender == ownerOfCV(x) && arbitratorOnCourt(dispute.courtID)
     * Permet d'accepté d'arbitrer une dispute lorsque l'on est invité
     */
    function acceptArbitration(uint _disputeID) external {
        address _dispute = IDisputesHub(_disputesHub).addressOf(_disputeID);
        IDispute(_dispute).acceptArbitration(_getCV(msg.sender));
    }

    /**
     * @notice Binding for refuse arbitration of dispute -- notOwner && worker&arbitrator
     * @param _disputeID must to be an existed ID -- onlyInvited
     * @dev this function trigger EscrowDatasHub && Dispute && ArbitratorsHub contracts
     * msg.sender == ownerOfCV(x) && arbitratorOnCourt(dispute.courtID)
     * Permet de refuser l'invitation à arbitrer une dispute lorsque l'on y est invité
     */
    function refuseArbitration(uint _disputeID) external {
        address _dispute = IDisputesHub(_disputesHub).addressOf(_disputeID);
        IDispute(_dispute).refuseArbitration(_getCV(msg.sender));
    }

    /**
     * @notice Binding for started vote period -- onlyOwnerOrWorker
     * @param _disputeID must to be an existed ID
     * @dev this function trigger EscrowDatasHub && Dispute contracts
     * msg.sender == ownerOfCV(x) && ownerOrWorker(featureID)
     * Permet de changer le workflow pour pouvoir démarrer le lancement des votes
     */
    function startedVotePeriod(uint _disputeID) external {
        address _dispute = IDisputesHub(_disputesHub).addressOf(_disputeID);
        IDispute(_dispute).startedVotePeriod(_getCV(msg.sender));
    }

    /**
     * @notice Binding for vote -- onlyArbitrator
     * @param _disputeID must to be an existed ID
     * @param _vote must not be Waiting (0)
     * @dev this function trigger EscrowDatasHub && Dispute && ArbitratorsHub contracts
     * msg.sender == ownerOfCV(x) && arbitratorOf(disputeID)
     * Permet à un arbitrator de voter pour une décision
     */

    function vote(uint _disputeID, DisputeRules.Vote _vote) external {
        address _dispute = IDisputesHub(_disputesHub).addressOf(_disputeID);
        IDispute(_dispute).vote(_getCV(msg.sender), _vote);
    }

    /**
     * @notice Binding for appeal -- onlyWorkerOrOwner
     * @param _disputeID must to be an existed ID
     * @dev this function trigger EscrowDatasHub && Dispute && ArbitratorsHub contracts
     * msg.sender == ownerOfCV(x) && workerOrOwner(featureID)
     * Permet au worker ou à l'owner de la feature de faire appel de la décision
     */
    function appeal(uint _disputeID) external {
        address _dispute = IDisputesHub(_disputesHub).addressOf(_disputeID);
        IDispute(_dispute).doAppeal(_getCV(msg.sender));
    }

    /**
     * @notice Binding for resolved dispute -- onlyWorkerOrOwner
     * @param _disputeID must to be an existed ID
     * @dev this function trigger EscrowDatasHub && Dispute  contracts
     * msg.sender == ownerOfCV(x) && workerOrOwner(featureID)
     * Permet au worker ou à l'owner de la feature de résoudre la dispute.
     * Elle ne peut être appelé que selon un workflow précis
     */
    function resolvedDispute(uint _disputeID) external {
        address _dispute = IDisputesHub(_disputesHub).addressOf(_disputeID);
        IDispute(_dispute).resolvedDispute(_getCV(msg.sender));
    }

    // ************* --------- ************* //
    // ************* Launchpad ************* //
    // ************* --------- ************* //

    function createLaunchpad(
        DataTypes.LaunchpadData memory _datas,
        DataTypes.TierData[] memory _tierDatas,
        string calldata _pubURI
    ) external payable {
        require(bytes(_pubURI).length > 0, "Must have pub URI");
        uint price = IBalancesHub(_iAH.balancesHub()).launchpadPrice();
        require(msg.value == price, "Launchpad price : Invalid value");
        uint cvID = _getCV(msg.sender);
        uint pubID = _createPub(cvID, _pubURI);
        uint newID = ILaunchpadHub(_iAH.launchpadsHub()).mint(
            cvID,
            _datas,
            _tierDatas,
            pubID
        );

        require(newID > 0, "Invalid launchpad ID");
    }

    function lockTokens(uint _launchpadID, uint _tokens) external {
        require(_tokens > 0, "Invalid tokens quantity");
        address launchpad = ILaunchpadHub(_iAH.launchpadsHub()).getLaunchpad(
            _launchpadID
        );
        ILaunchpad _iL = ILaunchpad(launchpad);

        _iL.lockTokens(_getCV(msg.sender), _tokens);
    }

    function _getCV(address _for) internal view returns (uint) {
        return Bindings.getCV(_for, _cvHub);
    }
}
