// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
// import "../Employer.sol";
import "./Milestone.sol";
import "../SBToken/CV.sol";

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
    ) internal view returns (Commit memory) {
        require(
            _assignedWorker != address(0),
            "You must assign a worker to this feature"
        );
        Commit memory _newCommit;
        _newCommit.oppenedAt = block.timestamp;
        _newCommit.assignedWorker = _assignedWorker;
        _newCommit.status = CommitStatus.Pending;

        return _newCommit;
    }
}
