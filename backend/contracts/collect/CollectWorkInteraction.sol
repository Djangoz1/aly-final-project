// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

import {DataTypes} from "../libraries/DataTypes.sol";
import {IAccessControl} from "../interfaces/IAccessControl.sol";
import {IFeaturesHub} from "../interfaces/IFeaturesHub.sol";
import {ICVHub} from "../interfaces/ICVHub.sol";
import {IAddressHub} from "../interfaces/IAddressHub.sol";
import {IDisputesHub} from "../interfaces/IDisputesHub.sol";

contract CollectWorkInteraction {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIDs;

    /**
     * @notice key uint is feature ID
     */
    mapping(uint => DataTypes.FeatureInteractionData) datas;

    address addrFH; // FeaturesHub address
    address addrHub; // AddressHub address

    modifier onlyProxy() {
        require(msg.sender == addrFH, "Must be call by proxy bindings");
        _;
    }

    modifier onlyOwnerOf(uint _featureID) {
        IFeaturesHub iFH = IFeaturesHub(addrFH);

        require(iFH.ownerOf(_featureID) == msg.sender, "Not the owner");
        _;
    }

    modifier onlyFeatureOpen(uint _featureID) {
        IFeaturesHub iFH = IFeaturesHub(addrFH);
        require(
            iFH.getData(_featureID).status == DataTypes.FeatureStatus.Process,
            "Wrong feature status"
        );
        _;
    }

    constructor(address _addressHub) {
        addrFH = msg.sender;
        addrHub = _addressHub;
    }

    function addFeature(uint _featureID) external onlyProxy {
        IFeaturesHub iFH = IFeaturesHub(addrFH);
        require(datas[_featureID].missionID == 0, "Data already set");
        uint missionID = iFH.getData(_featureID).missionID;
        datas[_featureID].missionID = missionID;
    }

    function inviteWorker(
        uint _cvWorkerID,
        uint _featureID
    ) external onlyOwnerOf(_featureID) onlyFeatureOpen(_featureID) {
        IFeaturesHub iFH = IFeaturesHub(addrFH);
        IAddressHub AH = IAddressHub(addrHub);
        ICVHub iCVH = ICVHub(AH.cvHub());

        require(iCVH.getCV(msg.sender) != _cvWorkerID, "Can't assign yourself");
        DataTypes.FeatureData memory featureData = iFH.getData(_featureID);
        featureData.cvWorker = _cvWorkerID;
        iFH.setFeature(_featureID, featureData);
    }

    function acceptJob(uint _featureID) external {
        IFeaturesHub iFH = IFeaturesHub(addrFH);
        IAddressHub AH = IAddressHub(addrHub);
        ICVHub iCVH = ICVHub(AH.cvHub());
        uint cvWorkerID = iCVH.getCV(msg.sender);
        require(
            iFH.getData(_featureID).cvWorker == cvWorkerID,
            "Not the worker"
        );
        DataTypes.FeatureData memory featureData = iFH.getData(_featureID);
        require(featureData.startedAt == 0, "Feature already start");

        uint[] memory empty;
        datas[_featureID].workerDemand = empty;
        datas[_featureID].signedWorker = cvWorkerID;
        datas[_featureID].workerAcceptJob = true;
        featureData.startedAt = block.timestamp;
        iFH.setFeature(_featureID, featureData);
    }

    function declineJob(uint _featureID) external {
        IFeaturesHub iFH = IFeaturesHub(addrFH);
        IAddressHub AH = IAddressHub(addrHub);
        ICVHub iCVH = ICVHub(AH.cvHub());
        uint cvWorkerID = iCVH.getCV(msg.sender);
        require(
            iFH.getData(_featureID).cvWorker == cvWorkerID,
            "Not the worker"
        );
        DataTypes.FeatureData memory featureData = iFH.getData(_featureID);
        require(featureData.startedAt == 0, "Feature already start");
        featureData.cvWorker = 0;
        iFH.setFeature(_featureID, featureData);
    }

    function askToJoin(uint _featureID) external onlyFeatureOpen(_featureID) {
        require(
            datas[_featureID].workerDemand.length <= 100,
            "Max 100 demands"
        );
        IFeaturesHub iFH = IFeaturesHub(addrFH);
        DataTypes.FeatureData memory featureData = iFH.getData(_featureID);
        require(featureData.isInviteOnly == false, "Only on invitation");
        require(featureData.cvWorker == 0, "Already have worker");
        IAddressHub AH = IAddressHub(addrHub);
        ICVHub iCVH = ICVHub(AH.cvHub());

        require(
            iFH.ownerOf(_featureID) != msg.sender,
            "Can't ask to join for own feature"
        );
        uint cvID = iCVH.getCV(msg.sender);
        require(cvID > 0, "Must have cv");
        datas[_featureID].workerDemand.push(cvID);
    }

    function signWorker(
        uint _featureID,
        uint _cvWorkerID
    )
        external
        onlyOwnerOf(_featureID)
        onlyFeatureOpen(_featureID)
        returns (bool)
    {
        _checkWorkerDemand(_cvWorkerID, _featureID);
        require(datas[_featureID].signedWorker == 0, "Already have worker");
        IFeaturesHub iFH = IFeaturesHub(addrFH);
        DataTypes.FeatureData memory featureData = iFH.getData(_featureID);

        featureData.cvWorker = _cvWorkerID;
        featureData.status = DataTypes.FeatureStatus.Process;
        featureData.startedAt = block.timestamp;
        bool success = iFH.setFeature(_featureID, featureData);
        require(success, "Can't set feature");

        datas[_featureID].signedWorker = _cvWorkerID;
        datas[_featureID].workerAcceptJob = true;
        uint[] memory empty;
        datas[_featureID].workerDemand = empty;
    }

    function improveFeature(
        uint _featureID,
        uint16 _estimatedDays
    ) external onlyOwnerOf(_featureID) onlyFeatureOpen(_featureID) {
        IFeaturesHub iFH = IFeaturesHub(addrFH);
        DataTypes.FeatureData memory featureData = iFH.getData(_featureID);

        require(featureData.startedAt > 0, "Feature not started");
        require(
            featureData.cvWorker == datas[_featureID].signedWorker,
            "Missmatch worker"
        );
        featureData.status = DataTypes.FeatureStatus.Improve;
        featureData.estimatedDays = _estimatedDays;
        bool success = iFH.setFeature(_featureID, featureData);
        require(success, "Can't set feature");
    }

    function contestFeature(
        uint _featureID,
        uint _reclamationPeriod,
        uint _nbArbitrators,
        string memory _tokenURI
    ) external returns (bool) {
        IFeaturesHub iFH = IFeaturesHub(addrFH);
        IAddressHub iAH = IAddressHub(addrHub);
        IDisputesHub iDH = IDisputesHub(iAH.disputesHub());
        require(
            iFH.getData(_featureID).status != DataTypes.FeatureStatus.Validated,
            "Wrong feature status"
        );
        DataTypes.FeatureData memory featureData = iFH.getData(_featureID);
        require(featureData.startedAt > 0, "Feature not started");
        require(
            featureData.cvWorker == datas[_featureID].signedWorker,
            "Missmatch worker"
        );
        require(
            featureData.status != DataTypes.FeatureStatus.Validated,
            "Already validate"
        );
        if (iFH.ownerOf(_featureID) == msg.sender) {
            require(datas[_featureID].ownerContest == false, "Already contest");
            datas[_featureID].ownerContest = true;
        } else {
            IAddressHub AH = IAddressHub(addrHub);
            ICVHub iCVH = ICVHub(AH.cvHub());
            require(
                featureData.cvWorker == iCVH.getCV(msg.sender),
                "Must call by owner or worker"
            );
            require(
                datas[_featureID].workerContest == false,
                "Already contest"
            );
            datas[_featureID].workerContest = true;
        }
        bool success = iDH.mint(
            msg.sender,
            _featureID,
            featureData.specification,
            _reclamationPeriod,
            _nbArbitrators,
            _tokenURI
        );
        require(success, "Can't create dispute");
        featureData.status = DataTypes.FeatureStatus.Contest;
        success = iFH.setFeature(_featureID, featureData);

        require(success, "Can't set feature");
    }

    function _checkWorkerDemand(
        uint _cvWorkerID,
        uint _featureID
    ) internal view returns (bool) {
        bool found = false;
        for (
            uint256 index = 0;
            index < datas[_featureID].workerDemand.length;
            index++
        ) {
            if (datas[_featureID].workerDemand[index] == _cvWorkerID) {
                found = true;
            }
        }
        require(found, "Demand not found");
        return true;
    }

    function getData(
        uint _featureID
    ) external view returns (DataTypes.FeatureInteractionData memory) {
        return datas[_featureID];
    }
}
