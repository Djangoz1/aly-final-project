// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

import {DataTypes} from "../libraries/DataTypes.sol";
import {Bindings} from "../libraries/Bindings.sol";
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

    address addrHub; // AddressHub address

    IAddressHub private _iAH;

    modifier onlyProxy() {
        require(
            msg.sender == _iAH.featuresHub() || msg.sender == _iAH.apiPost(),
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

    constructor(address _addressHub) {
        addrHub = _addressHub;
        _iAH = IAddressHub(_addressHub);
        _iAH.setCollectWorkInteraction();
        require(
            _iAH.collectWorkInteraction() == address(this),
            "Failed construct"
        );
    }

    function addFeature(uint _featureID) external onlyProxy {
        require(datas[_featureID].missionID == 0, "Data already set");
        uint missionID = _featureData(_featureID).missionID;
        datas[_featureID].missionID = missionID;
    }

    function inviteWorker(
        uint _cvID,
        uint _cvWorkerID,
        uint _featureID
    ) external onlyProxy onlyFeatureOpen(_featureID) {
        require(_cvID != _cvWorkerID, "Can't assign yourself");
        DataTypes.FeatureData memory featureData = _featureData(_featureID);
        featureData.cvWorker = _cvWorkerID;
        _setFeature(_featureID, featureData);
    }

    function acceptJob(uint _cvID, uint _featureID) external onlyProxy {
        DataTypes.FeatureData memory featureData = _featureData(_featureID);
        require(featureData.cvWorker == _cvID, "Not the worker");
        require(featureData.startedAt == 0, "Feature already start");
        uint[] memory empty;
        datas[_featureID].workerDemand = empty;
        datas[_featureID].signedWorker = _cvID;
        datas[_featureID].workerAcceptJob = true;
        featureData.startedAt = block.timestamp;
        _setFeature(_featureID, featureData);
    }

    function declineJob(uint _cvID, uint _featureID) external onlyProxy {
        DataTypes.FeatureData memory featureData = _featureData(_featureID);
        require(featureData.cvWorker == _cvID, "Not the worker");
        require(featureData.startedAt == 0, "Feature already start");
        featureData.cvWorker = 0;
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
        DataTypes.FeatureData memory featureData = _featureData(_featureID);
        require(featureData.isInviteOnly == false, "Only on invitation");
        require(featureData.cvWorker == 0, "Already have worker");

        require(
            _getCV(_ownerOf(_featureID)) != _cvID,
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
        IDisputesHub iDH = IDisputesHub(_iAH.disputesHub());
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
        if (_getCV(_ownerOf(_featureID)) == _cvID) {
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
            Bindings.ownerOf(_cvID, _iAH.cvHub()),
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

    function getData(
        uint _featureID
    ) external view returns (DataTypes.FeatureInteractionData memory) {
        return datas[_featureID];
    }

    function _getCV(address _for) internal view returns (uint) {
        return Bindings.getCV(_for, _iAH.cvHub());
    }

    function _featureData(
        uint _featureID
    ) internal view returns (DataTypes.FeatureData memory) {
        return IFeaturesHub(_iAH.featuresHub()).getData(_featureID);
    }

    function _ownerOf(uint _featureID) internal view returns (address) {
        return Bindings.ownerOf(_featureID, _iAH.featuresHub());
    }

    function _setFeature(
        uint _featureID,
        DataTypes.FeatureData memory _featureData
    ) internal returns (bool) {
        return
            IFeaturesHub(_iAH.featuresHub()).setFeature(
                _featureID,
                _featureData
            );
    }
}
