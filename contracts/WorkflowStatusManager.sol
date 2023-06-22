// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

import './lib/Milestone.sol';
contract WorkflowStatusManager is  Ownable {
    using Milestone for Milestone.FeatureStatus;

    enum MissionStatus {
        Registred,
        Pending,
        Approved,
        Aborted
    }

    MissionStatus public missionStatus;
    


    modifier onlyMissionOpen(){
        require(missionStatus == MissionStatus.Registred, "Mission not open");
        _;
    }
    
    function  _changeMissionStatus(MissionStatus _status) internal onlyOwner {
        missionStatus = _status;
    }
    
}