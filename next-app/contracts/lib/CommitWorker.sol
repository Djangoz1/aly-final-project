// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
// import "../Employer.sol";
import "./Milestone.sol";
import "../SBToken/CV.sol";
import "../Mission.sol";
import "../FactoryMission.sol";

library CommitWorker {
    // using Milestone for *;
    enum CommitStatus {
        Pending,
        Approved,
        Rejected
    }

    struct Commit {
        uint featureId; // id of the feature this commit is related to
        uint256 oppenedAt; // timestamp when commit was oppened
        address assignedWorker; // address of the worker assigned to this commit
        CommitStatus status;
        bool isDone; // if true, commit is done
        bool isApproved; // if true, commit is approved by owner
    }

    function _createCommit(
        address _assignedWorker
    ) public view returns (Commit memory) {
        require(
            _assignedWorker != address(0),
            "You must assign a worker to this feature"
        );
        Commit memory _newCommit;
        _newCommit.oppenedAt = block.timestamp;
        _newCommit.assignedWorker = _assignedWorker;
        _newCommit.status = CommitWorker.CommitStatus.Pending;

        return _newCommit;
    }

    function _beAssignedWorker(uint _id) public returns (Commit memory) {
        CV cv = CV(msg.sender);
        cv.setMission(address(this));

        Milestone.Feature memory _newFeatures;
        Commit memory _newCommit;

        _newCommit.oppenedAt = block.timestamp;
        _newCommit.featureId = _id;
        _newCommit.assignedWorker = msg.sender;
        _newCommit.status = CommitWorker.CommitStatus.Pending;
        return _newCommit;
    }

    function _getNewCommit(
        uint256 _id,
        address _assignedWorker
    ) public returns (Commit memory) {
        CV cv = CV(_assignedWorker);
        cv.setMission(address(this));
        Commit memory _newCommit;
        _newCommit.oppenedAt = block.timestamp;
        _newCommit.featureId = _id;
        _newCommit.assignedWorker = _assignedWorker;
        _newCommit.status = CommitWorker.CommitStatus.Pending;
        return _newCommit;
    }
}
