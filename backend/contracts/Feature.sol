// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import {DataTypes} from "./libraries/DataTypes.sol";
import {IAccessControl} from "./interfaces/IAccessControl.sol";
import {IFeaturesHub} from "./interfaces/IFeaturesHub.sol";
import {ICV} from "./interfaces/ICV.sol";

contract Feature is Ownable {
    uint256 public id;
    DataTypes.FeatureType workflow;
    DataTypes.FeatureData datas;

    IFeaturesHub featuresHub;
    IAccessControl accessControl;

    constructor(
        address _accessControl,
        uint256 _id,
        DataTypes.FeatureData memory _datas
    ) payable {
        accessControl = IAccessControl(_accessControl);
        require(
            accessControl.getFeaturesHub() == msg.sender,
            "Must deploy by FeatureHub"
        );
        _datas.createdAt = block.timestamp;
        datas = _datas;
        featuresHub = IFeaturesHub(msg.sender);
        id = _id;
    }

    function getDatas() external view returns (DataTypes.FeatureData memory) {
        return datas;
    }

    function assignWorker(address _worker) external onlyOwner {
        require(
            workflow == DataTypes.FeatureType.Waiting,
            "Not time to assign worker"
        );
        ICV cvWorker = ICV(_worker);
        accessControl.hasRegistred(cvWorker.owner());
        datas.assignedWorker = _worker;
        datas.startedAt = block.timestamp;
        workflow = DataTypes.FeatureType.Working;
    }
}
