// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import {DataTypes} from "../libraries/DataTypes.sol";
import {IAccessControl} from "../interfaces/system/IAccessControl.sol";
import {DisputeRules} from "../libraries/disputes/DisputeRules.sol";
import {Bindings} from "../libraries/Bindings.sol";

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
import {ICollectWorkInteraction} from "../interfaces/works/ICollectWorkInteraction.sol";

contract APIPost is Ownable {
    // Ajoutez votre code ici

    IAddressSystem _iAS;
    address private _cvsHub;
    address private _collectWorkInteraction;
    address private _featuresHub;
    address private _missionsHub;
    address private _pubsHub;
    address private _disputesHub;

    modifier ifTokenExist(uint _id, address _contract) {
        require(
            Bindings.tokensLength(_contract) >= _id,
            "PubsDatasHub: Invalid ID"
        );
        _;
    }

    modifier onlyCVOwner() {
        require(ICVsHub(_cvsHub).cvOf(msg.sender) > 0, "Must have CV");
        _;
    }

    modifier onlySatteliteContracts() {
        require(
            _disputesHub == msg.sender ||
                _featuresHub == msg.sender ||
                _iAS.launchpadsHub() == msg.sender,
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
        require(_iAS.apiPost() == address(this), "APIPost: Error deployment");
        _cvsHub = _iAS.cvsHub();
        _collectWorkInteraction = _iAS.collectWorkInteraction();
        _featuresHub = _iAS.featuresHub();
        _missionsHub = _iAS.missionsHub();
        _pubsHub = _iAS.pubsHub();
        _disputesHub = _iAS.disputesHub();
        require(_cvsHub != address(0), "APIPost : Must deploy CVsHub first");
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

    /**
     * @notice Binding for create a CV.
     * Each address could create only one cv
     * @param _tokenURI is for pinataCRUD by exemple
     * @dev this function trigger CVsHub contract
     */

    function createCV(string calldata _tokenURI) external {
        ICVsHub(_cvsHub).mint(msg.sender, _tokenURI);
    }

    /**
     * @notice Binding for follow cv.
     * Must have a cv for sender address & can't follow own cv.
     * @param _cvToFollow is cv ID want follow
     * @dev this function trigger cvsDatasHub contract
     */

    function followCV(uint _cvToFollow) external {
        uint cvFollower = _cvOf(msg.sender);
        require(_cvToFollow != cvFollower, "Can't follow yourself");
        require(
            Bindings.ownerOf(_cvToFollow, _cvsHub) != address(0),
            "ERC721: invalid token ID"
        );
        ICVsDatasHub(_iAS.cvsDatasHub()).follow(cvFollower, _cvToFollow);
    }

    /**
     * @notice Binding for unfollow cv.
     * Must have a cv for sender address & can't unfollow own cv & not followed cv.
     * @param _cvToUnfollow is cv ID want unfollow
     * @dev this function trigger cvsDatasHub contract
     */

    function unfollowCV(uint _cvToUnfollow) external {
        uint cvFollower = _cvOf(msg.sender);
        require(_cvToUnfollow != cvFollower, "Can't unfollow yourself");
        require(
            Bindings.ownerOf(_cvToUnfollow, _cvsHub) != address(0),
            "ERC721: invalid token ID"
        );
        ICVsDatasHub(_iAS.cvsDatasHub()).unfollow(cvFollower, _cvToUnfollow);
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
        uint missionPrice = IBalancesHub(_iAS.balancesHub()).missionPrice();
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

    /**
     * @notice Binding for create pub
     * @param _tokenURI is for pinataCRUD by exemple
     * @dev this function trigger PubsHub contract
     * msg.sender == ownerOfCV(x)
     * Permet de poster une publication
     */

    function createPub(string calldata _tokenURI) external {
        _createPub(_cvOf(msg.sender), _tokenURI);
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
    function createPubAnswer(
        uint _pubID,
        string calldata _tokenURI
    ) external ifTokenExist(_pubID, _pubsHub) {
        uint newPubID = _createPub(_cvOf(msg.sender), _tokenURI);
        require(newPubID != 0, "Error create pub");
        IPubsDatasHub(_iAS.pubsDatasHub()).addPubAnswer(
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
    ) external ifTokenExist(_missionID, _missionsHub) {
        uint newPubID = _createPub(_cvOf(msg.sender), _tokenURI);
        IPubsDatasHub(_iAS.pubsDatasHub()).addPubMission(
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
    function likePub(uint _pubID) external ifTokenExist(_pubID, _pubsHub) {
        IPubsDatasHub(_iAS.pubsDatasHub()).like(_cvOf(msg.sender), _pubID);
    }

    /**
     * @notice Binding for unlike pub
     * @param _pubID must to be an existed ID -- onlyLikedPub
     * @dev this function trigger PubsHub && CollectLikePubs contracts
     * msg.sender == ownerOfCV(x)
     * Permet d'unliké une publication liké
     */
    function unlikePub(uint _pubID) external ifTokenExist(_pubID, _pubsHub) {
        IPubsDatasHub(_iAS.pubsDatasHub()).unlike(_cvOf(msg.sender), _pubID);
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
        IArbitratorsHub(_iAS.arbitratorsHub()).investOnCourt(
            _cvOf(msg.sender),
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
        IArbitratorsHub(_iAS.arbitratorsHub()).withdrawFromCourt(
            _cvOf(msg.sender),
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
     * @dev this function trigger DisputesDatasHub && Dispute && ArbitratorsHub contracts
     * msg.sender == ownerOfCV(x) && arbitratorOnCourt(dispute.courtID)
     * Doit être trigger par le worker ou l'owner pour démarrer le workflow
     */
    function initDispute(uint _disputeID) external {
        address _dispute = IDisputesHub(_disputesHub).addressOf(_disputeID);
        IDispute(_dispute).init(_cvOf(msg.sender));
    }

    /**
     * @notice Binding for accept arbitration of dispute -- notOwner && worker&arbitrator
     * @param _disputeID must to be an existed ID -- onlyInvited
     * @dev this function trigger DisputesDatasHub && Dispute && ArbitratorsHub contracts
     * msg.sender == ownerOfCV(x) && arbitratorOnCourt(dispute.courtID)
     * Permet d'accepté d'arbitrer une dispute lorsque l'on est invité
     */
    function acceptArbitration(uint _disputeID) external {
        address _dispute = IDisputesHub(_disputesHub).addressOf(_disputeID);
        IDispute(_dispute).acceptArbitration(_cvOf(msg.sender));
    }

    /**
     * @notice Binding for refuse arbitration of dispute -- notOwner && worker&arbitrator
     * @param _disputeID must to be an existed ID -- onlyInvited
     * @dev this function trigger DisputesDatasHub && Dispute && ArbitratorsHub contracts
     * msg.sender == ownerOfCV(x) && arbitratorOnCourt(dispute.courtID)
     * Permet de refuser l'invitation à arbitrer une dispute lorsque l'on y est invité
     */
    function refuseArbitration(uint _disputeID) external {
        address _dispute = IDisputesHub(_disputesHub).addressOf(_disputeID);
        IDispute(_dispute).refuseArbitration(_cvOf(msg.sender));
    }

    /**
     * @notice Binding for started vote period -- onlyOwnerOrWorker
     * @param _disputeID must to be an existed ID
     * @dev this function trigger DisputesDatasHub && Dispute contracts
     * msg.sender == ownerOfCV(x) && ownerOrWorker(featureID)
     * Permet de changer le workflow pour pouvoir démarrer le lancement des votes
     */
    function startedVotePeriod(uint _disputeID) external {
        address _dispute = IDisputesHub(_disputesHub).addressOf(_disputeID);
        IDispute(_dispute).startedVotePeriod(_cvOf(msg.sender));
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
        address _dispute = IDisputesHub(_disputesHub).addressOf(_disputeID);
        IDispute(_dispute).vote(_cvOf(msg.sender), _vote);
    }

    /**
     * @notice Binding for appeal -- onlyWorkerOrOwner
     * @param _disputeID must to be an existed ID
     * @dev this function trigger DisputesDatasHub && Dispute && ArbitratorsHub contracts
     * msg.sender == ownerOfCV(x) && workerOrOwner(featureID)
     * Permet au worker ou à l'owner de la feature de faire appel de la décision
     */
    function appeal(uint _disputeID) external {
        address _dispute = IDisputesHub(_disputesHub).addressOf(_disputeID);
        IDispute(_dispute).doAppeal(_cvOf(msg.sender));
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
        address _dispute = IDisputesHub(_disputesHub).addressOf(_disputeID);
        IDispute(_dispute).resolvedDispute(_cvOf(msg.sender));
    }

    // ************* --------- ************* //
    // ************* Launchpad ************* //
    // ************* --------- ************* //

    function createLaunchpad(
        DataTypes.LaunchpadData memory _datas,
        DataTypes.TierData[] memory _tierDatas,
        string memory _tokenURI
    ) external payable {
        uint price = IBalancesHub(_iAS.balancesHub()).launchpadPrice();
        require(msg.value == price, "Launchpad price : Invalid value");
        uint cvID = _cvOf(msg.sender);
        uint newID = ILaunchpadHub(_iAS.launchpadsHub()).mint(
            cvID,
            _datas,
            _tierDatas
        );
        require(newID > 0, "Invalid launchpad ID");
        ILaunchpadsDatasHub(_iAS.launchpadsDatasHub()).setTokenURI(
            msg.sender,
            newID,
            _tokenURI
        );
    }

    function lockTokens(uint _launchpadID, uint _tokens) external {
        require(_tokens > 0, "Invalid tokens quantity");
        address launchpad = ILaunchpadHub(_iAS.launchpadsHub()).addressOf(
            _launchpadID
        );
        ILaunchpad _iL = ILaunchpad(launchpad);

        _iL.lockTokens(_cvOf(msg.sender), _tokens);
    }

    function _cvOf(address _for) internal view returns (uint) {
        return Bindings.cvOf(_for, _cvsHub);
    }
}