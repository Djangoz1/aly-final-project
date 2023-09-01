// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

import {DataTypes} from "./libraries/DataTypes.sol";

import {IAccessControl} from "./interfaces/IAccessControl.sol";

import {IMissionsHub} from "./interfaces/IMissionsHub.sol";
import {IFeaturesHub} from "./interfaces/IFeaturesHub.sol";

import {AddressHub} from "./storage/AddressHub.sol";
import {ILaunchpadCohort} from "./interfaces/ILaunchpadCohort.sol";
import {ILaunchpadHub} from "./interfaces/ILaunchpadHub.sol";
import {IWorkerProposalHub} from "./interfaces/IWorkerProposalHub.sol";
import {IPubsHub} from "./interfaces/IPubsHub.sol";
import {CVHub} from "./storage/CVHub.sol";

import {ICollectLikePub} from "./interfaces/ICollectLikePub.sol";

// import {IERC20Token} from "./interfaces/IERC20Token.sol";

contract AccessControl is Ownable {
    uint public missionPrice = 0.05 ether;
    uint public launchpadPrice = 0.4 ether;

    AddressHub private AHub;

    IWorkerProposalHub private iWPH;
    ICollectLikePub private iCLP;
    // IERC20Hub public iERC20H;

    DataTypes.InitStatus public workflow;

    constructor(address _addressHub) {
        require(_addressHub != address(0), "Must provide a valid address");
        AHub = AddressHub(_addressHub);
        AHub.setAccessControl(address(this));
    }

    modifier hasRegistred(address _ownerOf) {
        CVHub CVH = CVHub(AHub.cvHub());
        require(CVH.balanceOf(_ownerOf) == 1, "CV not exist");
        _;
    }

    modifier onlySatteliteContracts() {
        require(
            AHub.disputesHub() == msg.sender ||
                AHub.featuresHub() == msg.sender,
            "Only callable by our contracts"
        );
        _;
    }

    function initWorkflow() external {
        require(
            workflow == DataTypes.InitStatus.Initialization,
            "Already init"
        );
        workflow = DataTypes.InitStatus.Init;
    }

    // *::::::::::::::: ----------- :::::::::::::::* //
    // *::::::::::::::: CV BINDINGS :::::::::::::::* //
    // *::::::::::::::: ----------- :::::::::::::::* //

    /**
     * @notice This function can called only one time per address
     * @dev Second call will be reverted by CVH.createCV(_owner) because sender have already CV
     */
    function createCV(string calldata _tokenURI) external {
        CVHub CVH = CVHub(AHub.cvHub());
        CVH.mint(msg.sender, _tokenURI);
    }

    // *::::::::::::::: ------------ :::::::::::::::* //
    // *::::::::::::::: PUB BINDINGS :::::::::::::::* //
    // *::::::::::::::: ------------ :::::::::::::::* //

    function _createPub(
        string calldata _tokenURI,
        address _sender
    ) internal hasRegistred(_sender) returns (uint) {
        IPubsHub iPH = IPubsHub(AHub.pubsHub());
        CVHub CVH = CVHub(AHub.cvHub());
        uint cvID = CVH.getCV(_sender);

        uint newPub = iPH.mint(cvID, _tokenURI);
        return newPub;
    }

    function createPub(string calldata _tokenURI) external returns (uint) {
        uint newPub = _createPub(_tokenURI, msg.sender);
        return newPub;
    }

    function createPub(
        string calldata _tokenURI,
        address _sender
    ) external returns (uint) {
        uint newPub = _createPub(_tokenURI, _sender);
        return newPub;
    }

    function sendTransaction(
        address _to,
        uint _value
    ) external payable onlySatteliteContracts returns (bool) {
        // Transférer les ETH à l'adresse spécifiée
        (bool success, ) = _to.call{value: _value}("");
        require(success, "Transaction failed");
        return true;
    }

    // function followPub(uint _pubID) external hasRegistred(msg.sender) {
    //     iCLP.mint(msg.sender, _pubID);
    // }

    // *:::::::::::: ----------------- ::::::::::::* //
    // *:::::::::::: MISSIONS BINDINGS ::::::::::::* //
    // *:::::::::::: ----------------- ::::::::::::* //

    function buyMission(
        string calldata _tokenURI
    ) external payable hasRegistred(msg.sender) {
        require(
            msg.value == missionPrice,
            "Value must to be equal mission price"
        );
        IMissionsHub iMH = IMissionsHub(AHub.missionsHub());
        iMH.mint(msg.sender, _tokenURI);
    }

    // *:::::::::::: ----------------- ::::::::::::* //
    // *:::::::::::: FEATURES BINDINGS ::::::::::::* //
    // *:::::::::::: ----------------- ::::::::::::* //

    function createFeature(
        uint _missionID,
        uint16 _estimatedDays,
        bool _isInviteOnly,
        string memory _tokenURI,
        DataTypes.CourtIDs _specification
    ) external payable hasRegistred(msg.sender) {
        IFeaturesHub iFH = IFeaturesHub(AHub.featuresHub());
        require(msg.value > 0, "Must provide a value");
        require(bytes(_tokenURI).length > 0, "Feature must have a metadata");

        iFH.mint(
            msg.sender,
            _missionID,
            msg.value,
            _estimatedDays,
            _isInviteOnly,
            _tokenURI,
            _specification
        );
    }

    // *:::::::::::: ------------------------ ::::::::::::* //
    // *:::::::::::: WORKER PROPOSAL BINDINGS ::::::::::::* //
    // *:::::::::::: ------------------------ ::::::::::::* //

    function createWorkerProposal(
        string calldata _tokenURI,
        uint _featureID
    ) external hasRegistred(msg.sender) {
        // IFeaturesHub iFH = IFeaturesHub(AHub.featuresHub());

        // DataTypes.FeatureData memory data = iFH.getData(_featureID);

        // if (data.cvWorker != 0) {
        //     require(
        //         data.cvWorker == msg.sender,
        //         "Must be assigned for propose a work"
        //     );
        // }

        iWPH.postWorkerProposal(msg.sender, _tokenURI, _featureID);
    }

    // *:::::::::::: ------------------ ::::::::::::* //
    // *:::::::::::: LAUNCHPAD BINDINGS ::::::::::::* //
    // *:::::::::::: ------------------ ::::::::::::* //

    /**
     * @notice launchpad owned by address and not by cv address
     */
    function createLaunchpad(
        DataTypes.LaunchpadData memory _datas,
        DataTypes.TierData[] memory _tiersDatas,
        string memory _pubURI
    ) external payable hasRegistred(msg.sender) {
        ILaunchpadCohort iLC = ILaunchpadCohort(AHub.launchpadCohort());
        ILaunchpadHub iLH = ILaunchpadHub(iLC.launchpadHub());

        require(msg.value == launchpadPrice, "Invalid value for launchpad");
        uint newID = iLH.mint(msg.sender, _datas, _tiersDatas, _pubURI);
        require(newID > 0, "Invalid launchpad ID");
    }
}
