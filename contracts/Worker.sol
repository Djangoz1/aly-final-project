// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

import "./lib/CommitWorker.sol";
import './Mission.sol';
import "./Employer.sol";

contract Worker is Employer {
    using CommitWorker for *;
    
    Mission public mission = Mission(address(this));

    mapping(uint => CommitWorker.Commit[]) commits; // commits related to this feature (commitId => featureId)


    modifier onlyWorker(uint _id) {
        CV cv = _getCV(msg.sender);
        require(address(cv) != address(0),"You must have a CV to be a worker");
            require(_id < features.length, "Feature not found");
                require(features[_id].assignedWorker == msg.sender,"Only assigned worker can call this function");
        _;
    }

    modifier onlyWorkerOrOwner(uint _id) {
        require(features[_id].assignedWorker == msg.sender || msg.sender == owner(),"Only workers or owner can call this function");
        _;
    }


    function _getCV (address _addr) public view returns (CV) {
        require(_addr != address(0), "You must provide an address");
            require(mission.factoryCV().getCV(_addr) != address(0),"You didn't have a CV");

        return CV(mission.factoryCV().getCV(_addr));
    }


    function addAssignedWorker(
        bool isWeb3,
        uint256 _id,
        address _assignedWorker
    ) public onlyOwner onlyFeatureOpen(_id) {
        if (isWeb3) {
            require(_id < featuresWeb3.length, "Feature not found");
            featuresWeb3[_id].feature.assignedWorker = _assignedWorker;
        } else {
            require(_id < features.length, "Feature not found");
        }
        require(_assignedWorker != address(0),"You must assign a worker to this feature");
        CV cv = _getCV(_assignedWorker);
        cv.setMission(address(this));
        features[_id].assignedWorker = _assignedWorker;
        features[_id].commitLength += 1;
        commits[_id][features[_id].commitLength].oppenedAt = block.timestamp;
        commits[_id][features[_id].commitLength].featureId = _id;
        commits[_id][features[_id].commitLength].assignedWorker = _assignedWorker;
        commits[_id][features[_id].commitLength].status = CommitWorker.CommitStatus.Pending;
    }


    function beAssignedWorker(
        uint256 _id
    ) public  onlyFeatureOpen(_id) {
        require(_id < features.length, "Feature not found");
        require(features[_id].isInviteOnly == false,"This feature is invite only");
        require(features[_id].assignedWorker == address(0),"This feature already has a worker assigned");
        CV cv = _getCV(msg.sender);
        cv.setMission(address(this));

        features[_id].assignedWorker = msg.sender;
        features[_id].commitLength += 1;
        commits[_id][features[_id].commitLength].oppenedAt = block.timestamp;
        commits[_id][features[_id].commitLength].featureId = _id;
        commits[_id][features[_id].commitLength].assignedWorker = msg.sender;
        commits[_id][features[_id].commitLength].status = CommitWorker.CommitStatus.Pending;
    }

    function beAssignedWorkerWeb3(
        uint256 _id
    ) public onlyWorker(_id) onlyFeatureOpen(_id) {
        require(_id < featuresWeb3.length, "Feature not found");
        require( featuresWeb3[_id].feature.isInviteOnly == false,"This feature is invite only");
        require(featuresWeb3[_id].feature.assignedWorker == address(0),"This feature already has a worker assigned");
        CV cv = _getCV(msg.sender);
        cv.setMission(address(this));

        featuresWeb3[_id].feature.assignedWorker = msg.sender;
        featuresWeb3[_id].feature.commitLength += 1;
        commits[_id][featuresWeb3[_id].feature.commitLength].oppenedAt = block.timestamp;
        commits[_id][featuresWeb3[_id].feature.commitLength].featureId = _id;
        commits[_id][featuresWeb3[_id].feature.commitLength].assignedWorker = msg.sender;
        commits[_id][featuresWeb3[_id].feature.commitLength].status = CommitWorker.CommitStatus.Pending;
    }
}