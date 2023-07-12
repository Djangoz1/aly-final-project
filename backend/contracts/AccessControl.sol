// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

import {DataTypes} from "./libraries/DataTypes.sol";
import {DataRecast} from "./libraries/DataRecast.sol";
import {IAccessControl} from "./interfaces/IAccessControl.sol";

import {IMissionsHub} from "./interfaces/IMissionsHub.sol";
import {IFeaturesHub} from "./interfaces/IFeaturesHub.sol";

import {IWorkerProposalHub} from "./interfaces/IWorkerProposalHub.sol";
import {IPubsHub} from "./interfaces/IPubsHub.sol";
import {IFactoryCV} from "./interfaces/IFactoryCV.sol";
import {ICV} from "./interfaces/ICV.sol";

contract AccessControl is Ownable {
    uint cvPrice = 100;
    uint missionPrice = 200;

    IMissionsHub public iMH;
    IFactoryCV public iFCV;
    IPubsHub public iPH;
    IFeaturesHub public iFH;
    IWorkerProposalHub public iWPH;

    DataTypes.AccessControlStatus public workflow;

    modifier onlyInit() {
        require(
            workflow == DataTypes.AccessControlStatus.Init,
            "Init is not ready"
        );
        _;
    }

    modifier onlyStart() {
        require(
            workflow == DataTypes.AccessControlStatus.Initialization,
            "Init is not ready"
        );
        _;
    }

    function hasInit() internal view returns (bool) {
        if (
            address(iMH) != address(0) &&
            address(iFCV) != address(0) &&
            address(iFH) != address(0) &&
            address(iWPH) != address(0) &&
            address(iPH) != address(0)
        ) {
            return true;
        } else {
            return false;
        }
    }

    function hasRegistred(address _forCheck) external view {
        iFCV.checkRegistred(_forCheck);
    }

    // *::::::::::::::: -------------- :::::::::::::::* //
    // *::::::::::::::: Initialisation :::::::::::::::* //
    // *::::::::::::::: -------------- :::::::::::::::* //

    function setPubHub(address _pubHub) external onlyStart {
        iPH = IPubsHub(_pubHub);
        if (hasInit()) {
            workflow = DataTypes.AccessControlStatus.Init;
        }
    }

    function getPubHub() external view onlyInit returns (address) {
        return address(iPH);
    }

    function setFactoryCV(address _factoryCV) external onlyStart {
        iFCV = IFactoryCV(_factoryCV);
        if (hasInit()) {
            workflow = DataTypes.AccessControlStatus.Init;
        }
    }

    function getFactoryCV() external view onlyInit returns (address) {
        return address(iFCV);
    }

    function setMissionsHub(address _missionsHub) external onlyStart {
        iMH = IMissionsHub(_missionsHub);
        if (hasInit()) {
            workflow = DataTypes.AccessControlStatus.Init;
        }
    }

    function getMissionsHub() external view onlyInit returns (address) {
        return address(iMH);
    }

    function setFeaturesHub(address _featuresHub) external onlyStart {
        iFH = IFeaturesHub(_featuresHub);
        if (hasInit()) {
            workflow = DataTypes.AccessControlStatus.Init;
        }
    }

    function getFeaturesHub() external view onlyInit returns (address) {
        return address(iFH);
    }

    function setWorkerProposalHub(
        address _workerProposalHub
    ) external onlyStart {
        iWPH = IWorkerProposalHub(_workerProposalHub);
        if (hasInit()) {
            workflow = DataTypes.AccessControlStatus.Init;
        }
    }

    function getWorkerProposalHub() external view onlyInit returns (address) {
        return address(iWPH);
    }

    // *::::::::::::::: ----------- :::::::::::::::* //
    // *::::::::::::::: CV BINDINGS :::::::::::::::* //
    // *::::::::::::::: ----------- :::::::::::::::* //

    /**
     * @notice This function can called only one time per address
     * @dev Second call will be reverted by iFCV.createCV(_owner) because sender have already CV
     * @return address target deployment cv
     */
    function buyCV() external payable onlyInit returns (address) {
        require(msg.value > cvPrice, "Value must be greater than price");
        address newCV = iFCV.createCV(msg.sender);
        return newCV;
    }

    /**
     * @param _addr owner of cv
     * @return address of cv
     */
    function getCVByAddress(
        address _addr
    ) external view onlyInit returns (address) {
        return iFCV.getCVByAddress(_addr);
    }

    // *::::::::::::::: ------------ :::::::::::::::* //
    // *::::::::::::::: PUB BINDINGS :::::::::::::::* //
    // *::::::::::::::: ------------ :::::::::::::::* //

    function createPub(
        string calldata _tokenURI
    ) external onlyInit returns (uint) {
        iFCV.checkRegistred(msg.sender);
        uint newPub = iPH.postPub(iFCV.getCVByAddress(msg.sender), _tokenURI);
        return newPub;
    }

    // *:::::::::::: ----------------- ::::::::::::* //
    // *:::::::::::: MISSIONS BINDINGS ::::::::::::* //
    // *:::::::::::: ----------------- ::::::::::::* //

    function buyMission(string calldata _tokenURI) external payable {
        require(msg.value >= missionPrice, "Value out of price range !");
        iFCV.checkRegistred(msg.sender);
        address cv = iFCV.getCVByAddress(msg.sender);
        iMH.createMission(cv, _tokenURI);
    }

    // *:::::::::::: ----------------- ::::::::::::* //
    // *:::::::::::: FEATURES BINDINGS ::::::::::::* //
    // *:::::::::::: ----------------- ::::::::::::* //

    function postFeature(
        DataTypes.FeatureData memory _data
    ) external payable onlyInit {
        require(msg.value > 0, "Must provide a value");
        require(_data.missionID > 0, "Must provide a mission");
        //! Faire un require sur le fait que la mission lui appartien bien
        require(
            bytes(_data.tokenURI).length > 0,
            "Feature must have a metadata"
        );
        iMH.checkRegistred(_data.missionID);
        iFCV.checkRegistred(msg.sender);
        if (_data.assignedWorker != address(0)) {
            ICV cvWorker = ICV(_data.assignedWorker);
            iFCV.checkRegistred(cvWorker.owner());
            _data.isInviteOnly = true;
        }
        _data.createdAt = block.timestamp;
        _data.wadge = msg.value;
        iFH.createFeature(iFCV.getCVByAddress(msg.sender), _data);
    }

    // *:::::::::::: ------------------------ ::::::::::::* //
    // *:::::::::::: WORKER PROPOSAL BINDINGS ::::::::::::* //
    // *:::::::::::: ------------------------ ::::::::::::* //

    function createWorkerProposal(
        string calldata _tokenURI,
        uint _featureID
    ) external onlyInit {
        iFCV.checkRegistred(msg.sender);
        DataTypes.FeatureData memory data = iFH.getDatas(_featureID);

        if (data.assignedWorker != address(0)) {
            require(
                data.assignedWorker == msg.sender,
                "Must be assigned for propose a work"
            );
        }

        iWPH.postWorkerProposal(
            iFCV.getCVByAddress(msg.sender),
            _tokenURI,
            _featureID
        );
    }
}
