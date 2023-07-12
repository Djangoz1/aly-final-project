// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

import {DataTypes} from "./libraries/DataTypes.sol";
import {DataRecast} from "./libraries/DataRecast.sol";
import {IAccessControl} from "./interfaces/IAccessControl.sol";
import {IFactoryMission} from "./interfaces/IFactoryMission.sol";
import {IFeaturesHub} from "./interfaces/IFeaturesHub.sol";
import {IFeature} from "./interfaces/IFeature.sol";
import {IWorkerProposalHub} from "./interfaces/IWorkerProposalHub.sol";
import {IPubHub} from "./interfaces/IPubHub.sol";
import {IFactoryCV} from "./interfaces/IFactoryCV.sol";
import {ICV} from "./interfaces/ICV.sol";

contract AccessControl is Ownable {
    uint cvPrice = 100;
    uint missionPrice = 200;

    IFactoryMission public iFMI;
    IFactoryCV public iFCV;
    IPubHub public iPH;
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
            address(iFMI) != address(0) &&
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
        iPH = IPubHub(_pubHub);
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

    function setFactoryMission(address _factoryMission) external onlyStart {
        iFMI = IFactoryMission(_factoryMission);
        if (hasInit()) {
            workflow = DataTypes.AccessControlStatus.Init;
        }
    }

    function getFactoryMission() external view onlyInit returns (address) {
        return address(iFMI);
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
        DataTypes.PubData memory _datas
    ) external onlyInit returns (address) {
        iFCV.checkRegistred(msg.sender);
        ICV iCV = ICV(_datas.publisher);
        require(
            iCV.owner() == msg.sender,
            "Must create a post with your own CV"
        );
        iFCV.checkRegistred(iCV.owner());
        address newPub = iPH.postPub(_datas);
        return newPub;
    }

    /**
     * @notice This function can called only
     */
    function getPubIndexers(
        address _addr
    ) external view onlyInit returns (uint[] memory) {
        ICV iCV = ICV(_addr);
        iFCV.checkRegistred(iCV.owner());
        uint[] memory indexer = iPH.getIndexerByAddr(_addr);
        return indexer;
    }

    function getPubById(uint _id) external view onlyInit returns (address) {
        return iPH.getPubById(_id);
    }

    // *:::::::::::: ----------------- ::::::::::::* //
    // *:::::::::::: MISSIONS BINDINGS ::::::::::::* //
    // *:::::::::::: ----------------- ::::::::::::* //

    function buyMission() external payable {
        require(msg.value >= missionPrice, "Value out of price range !");
        iFCV.checkRegistred(msg.sender);
        address cv = iFCV.getCVByAddress(msg.sender);
        iFMI.createMission(cv);
    }

    /**
     * @param _cvAddr address of cv owner
     * @return indexer of missions id for this cv
     */
    function getMissionsIndexers(
        address _cvAddr
    ) external view onlyInit returns (uint[] memory) {
        ICV icv = ICV(_cvAddr);
        iFCV.checkRegistred(icv.owner());
        return iFMI.getIndexers(_cvAddr);
    }

    function getMissionById(uint _id) external view returns (address) {
        iFMI.checkRegistred(_id);
        return iFMI.getMission(_id);
    }

    // *:::::::::::: ----------------- ::::::::::::* //
    // *:::::::::::: FEATURES BINDINGS ::::::::::::* //
    // *:::::::::::: ----------------- ::::::::::::* //

    function postFeature(
        DataTypes.CreationFeatureData memory _data
    ) external payable onlyInit {
        require(msg.value == _data.wadge, "Missmatch value and wadge data");
        iFCV.checkRegistred(msg.sender);
        if (_data.assignedWorker != address(0)) {
            ICV cvWorker = ICV(_data.assignedWorker);
            iFCV.checkRegistred(cvWorker.owner());
        }
        DataTypes.FeatureData memory _featureData = DataRecast.castFeatureData(
            _data
        );
        iFH.createFeature(iFCV.getCVByAddress(msg.sender), _featureData);
    }

    function getFeatureIndexers(
        address _cvAddr
    ) external view onlyInit returns (uint256[] memory) {
        ICV icv = ICV(_cvAddr);

        iFCV.checkRegistred(icv.owner());
        return iFH.getIndexersByAddress(_cvAddr);
    }

    function getFeatureById(uint _id) external view onlyInit returns (address) {
        return iFH.getFeatureById(_id);
    }

    // *:::::::::::: ------------------------ ::::::::::::* //
    // *:::::::::::: WORKER PROPOSAL BINDINGS ::::::::::::* //
    // *:::::::::::: ------------------------ ::::::::::::* //

    function createWorkerProposal(
        string calldata _tokenURI,
        uint _featureID
    ) external onlyInit {
        iFCV.checkRegistred(msg.sender);
        IFeature feature = IFeature(iFH.getFeatureById(_featureID));
        address assignedWorker = feature.getDatas().assignedWorker;
        if (assignedWorker != address(0)) {
            require(
                assignedWorker == msg.sender,
                "Must be assigned for propose a work"
            );
        } else {
            require(
                feature.getDatas().isInviteOnly == false,
                "Can't propose a work for a locked feature"
            );
        }

        iWPH.postWorkerProposal(
            iFCV.getCVByAddress(msg.sender),
            _tokenURI,
            _featureID
        );
    }
}
