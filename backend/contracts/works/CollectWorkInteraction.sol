// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
// import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

import {DataTypes} from "../libraries/DataTypes.sol";
import {Bindings} from "../libraries/Bindings.sol";

import {IAccessControl} from "../interfaces/system/IAccessControl.sol";
import {IAddressSystem} from "../interfaces/system/IAddressSystem.sol";
import {IFeaturesHub} from "../interfaces/works/IFeaturesHub.sol";
import {ICVsHub} from "../interfaces/cv/ICVsHub.sol";
import {IDisputesHub} from "../interfaces/escrow/IDisputesHub.sol";

contract CollectWorkInteraction is Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIDs;

    mapping(uint => mapping(uint => bool)) featureToInvites;
    mapping(uint => uint[]) cvsToInvites;

    /**
     * @notice key uint is feature ID
     */
    mapping(uint => DataTypes.FeatureInteractionData) datas;

    // missionID to featureID
    mapping(uint => uint[]) indexerMissions;

    // cv worker return featuresIDs[]
    mapping(uint => uint[]) cvsToJobs;

    IAddressSystem private _iAS;

    modifier onlyProxy() {
        require(
            msg.sender == _iAS.featuresHub() || msg.sender == _iAS.apiPost(),
            "Must be call by proxy bindings"
        );
        _;
    }

    modifier onlyFeatureOpen(uint _featureID) {
        require(
            _featureData(_featureID).status == DataTypes.FeatureStatus.Process,
            "Wrong feature status"
        );
        _;
    }

    constructor(address _addressSystem) {
        _iAS = IAddressSystem(_addressSystem);
        _iAS.setCollectWorkInteraction();
        require(
            _iAS.collectWorkInteraction() == address(this),
            "CollectWorkInteraction: Error deployment"
        );
    }

    function addFeature(uint _featureID) external onlyProxy {
        require(datas[_featureID].missionID == 0, "Data already set");
        uint missionID = _featureData(_featureID).missionID;
        datas[_featureID].missionID = missionID;

        indexerMissions[missionID].push(_featureID);
    }

    function indexerOf(uint _missionID) external view returns (uint[] memory) {
        return indexerMissions[_missionID];
    }

    function jobsOf(uint _cvID) external view returns (uint[] memory) {
        return cvsToJobs[_cvID];
    }

    function invitesOf(uint _cvID) external view returns (uint[] memory) {
        return cvsToInvites[_cvID];
    }

    function inviteWorker(
        uint _cvID,
        uint _cvWorkerID,
        uint _featureID
    ) external onlyProxy onlyFeatureOpen(_featureID) {
        require(_cvID != _cvWorkerID, "Can't assign yourself");
        require(_featureData(_featureID).startedAt == 0, "Already started");
        require(!featureToInvites[_featureID][_cvWorkerID], "Already invite");
        require(
            cvsToInvites[_cvWorkerID].length <= 100,
            "Worker have exceed invitation"
        );
        featureToInvites[_featureID][_cvWorkerID] = true;
        cvsToInvites[_cvWorkerID].push(_featureID);
    }

    function acceptJob(uint _cvID, uint _featureID) external onlyProxy {
        DataTypes.FeatureData memory featureData = _featureData(_featureID);
        require(featureData.startedAt == 0, "Feature already start");
        require(featureToInvites[_featureID][_cvID], "Not invited");
        uint[] memory empty;
        datas[_featureID].workerDemand = empty;
        datas[_featureID].signedWorker = _cvID;
        datas[_featureID].workerAcceptJob = true;
        featureData.startedAt = block.timestamp;
        featureData.cvWorker = _cvID;
        cvsToJobs[_cvID].push(_featureID);
        uint[] memory _newInvites;

        for (uint256 index = 0; index < cvsToInvites[_cvID].length; index++) {
            uint featureID_ = cvsToInvites[_cvID][index];
            if (featureID_ != _featureID) {
                _newInvites[index] = featureID_;
            }
        }
        cvsToInvites[_cvID] = _newInvites;

        _setFeature(_featureID, featureData);
    }

    function declineJob(uint _cvID, uint _featureID) external onlyProxy {
        DataTypes.FeatureData memory featureData = _featureData(_featureID);
        require(featureToInvites[_featureID][_cvID] == true, "Not invited");

        require(featureData.startedAt == 0, "Feature already start");

        uint[] memory _newInvites;
        for (uint256 index = 0; index < cvsToInvites[_cvID].length; index++) {
            uint featureID_ = cvsToInvites[_cvID][index];
            if (featureID_ != _featureID) {
                _newInvites[index] = featureID_;
            }
        }

        cvsToInvites[_cvID] = _newInvites;
        featureToInvites[_featureID][_cvID] = false;
        _setFeature(_featureID, featureData);
    }

    function askToJoin(
        uint _cvID,
        uint _featureID
    ) external onlyProxy onlyFeatureOpen(_featureID) {
        require(
            datas[_featureID].workerDemand.length <= 100,
            "Max 100 demands"
        );
        bool allowed = true;
        for (
            uint256 index = 0;
            index < datas[_featureID].workerDemand.length;
            index++
        ) {
            uint cvID_ = datas[_featureID].workerDemand[index];
            if (cvID_ == _cvID) {
                allowed = false;
            }
        }
        require(allowed, "Already ask to join");
        DataTypes.FeatureData memory featureData = _featureData(_featureID);
        require(featureData.isInviteOnly == false, "Only on invitation");
        require(featureData.cvWorker == 0, "Already have worker");

        require(
            _cvOf(_ownerOf(_featureID)) != _cvID,
            "Can't ask to join for own feature"
        );
        datas[_featureID].workerDemand.push(_cvID);
    }

    function signWorker(
        uint _featureID,
        uint _cvWorkerID
    ) external onlyProxy onlyFeatureOpen(_featureID) returns (bool) {
        _checkWorkerDemand(_cvWorkerID, _featureID);
        require(datas[_featureID].signedWorker == 0, "Already have worker");

        DataTypes.FeatureData memory featureData = _featureData(_featureID);

        featureData.cvWorker = _cvWorkerID;
        featureData.status = DataTypes.FeatureStatus.Process;
        featureData.startedAt = block.timestamp;
        bool success = _setFeature(_featureID, featureData);
        require(success, "Can't set feature");

        datas[_featureID].signedWorker = _cvWorkerID;
        datas[_featureID].workerAcceptJob = true;
        uint[] memory empty;
        datas[_featureID].workerDemand = empty;
        cvsToJobs[_cvWorkerID].push(_featureID);
    }

    function improveFeature(
        uint _featureID,
        uint16 _estimatedDays
    ) external onlyProxy onlyFeatureOpen(_featureID) {
        DataTypes.FeatureData memory featureData = _featureData(_featureID);

        require(featureData.startedAt > 0, "Feature not started");
        require(
            featureData.cvWorker == datas[_featureID].signedWorker,
            "Missmatch worker"
        );
        featureData.status = DataTypes.FeatureStatus.Improve;
        featureData.estimatedDays = _estimatedDays;
        bool success = _setFeature(_featureID, featureData);
        require(success, "Can't set feature");
    }

    function contestFeature(
        uint _cvID,
        uint _featureID,
        uint32 _reclamationPeriod,
        uint8 _nbArbitrators,
        string memory _tokenURI
    ) external onlyProxy returns (bool) {
        IDisputesHub iDH = IDisputesHub(_iAS.disputesHub());
        DataTypes.FeatureData memory featureData = _featureData(_featureID);
        require(
            featureData.status != DataTypes.FeatureStatus.Validated,
            "Wrong feature status"
        );
        require(featureData.startedAt > 0, "Feature not started");
        require(
            featureData.cvWorker == datas[_featureID].signedWorker,
            "Missmatch worker"
        );
        require(
            featureData.status != DataTypes.FeatureStatus.Validated,
            "Already validate"
        );
        if (_cvOf(_ownerOf(_featureID)) == _cvID) {
            require(datas[_featureID].ownerContest == false, "Already contest");
            datas[_featureID].ownerContest = true;
        } else {
            require(
                featureData.cvWorker == _cvID,
                "Must call by owner or worker"
            );
            require(
                datas[_featureID].workerContest == false,
                "Already contest"
            );
            datas[_featureID].workerContest = true;
        }

        require(address(iDH) != address(0), "Error API address");

        bool success = iDH.mint(
            Bindings.ownerOf(_cvID, _iAS.cvsHub()),
            _featureID,
            featureData.specification,
            _reclamationPeriod,
            _nbArbitrators,
            _tokenURI
        );
        require(success, "Can't create dispute");
        featureData.status = DataTypes.FeatureStatus.Contest;
        success = _setFeature(_featureID, featureData);

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

    function dataOf(
        uint _featureID
    ) external view returns (DataTypes.FeatureInteractionData memory) {
        return datas[_featureID];
    }

    function _cvOf(address _for) internal view returns (uint) {
        return Bindings.cvOf(_for, _iAS.cvsHub());
    }

    function _featureData(
        uint _featureID
    ) internal view returns (DataTypes.FeatureData memory) {
        return IFeaturesHub(_iAS.featuresHub()).dataOf(_featureID);
    }

    function _ownerOf(uint _featureID) internal view returns (address) {
        return Bindings.ownerOf(_featureID, _iAS.featuresHub());
    }

    function _setFeature(
        uint _featureID,
        DataTypes.FeatureData memory _featureData
    ) internal returns (bool) {
        return
            IFeaturesHub(_iAS.featuresHub()).setFeature(
                _featureID,
                _featureData
            );
    }
}
