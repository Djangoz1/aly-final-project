// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

import "./CommitWorker.sol";

library Milestone {
    using CommitWorker for CommitWorker.Commit;
    enum FeatureStatus {
        Pending,
        Approved,
        Rejected
    }
    enum FeatureType {
        NewFeature,
        Bug,
        Improvement
    }

    struct Feature {
        uint id;
        string description;
        uint256 oppenedAt; // timestamp when feature was oppened
        uint256 wadge; // wadge in wei
        uint16 estimatedDays; // estimated hours to complete this feature
        uint16 commitLength; // number of commits related to this feature
        bool isDone; // if true, feature is done
        bool isInviteOnly; // if true, only assigned worker can work on this feature
        address assignedWorker; // address of the worker assigned to this feature
        FeatureType featureType;
        FeatureStatus status;
    }

    struct FeatureWeb3 {
        address addrContract; // address of the contract that deployed with this feature
        address addrOwner; // address of the owner of the contract that deployed with this feature
        Feature feature; // feature data
    }

    // *:::::::::::  GETTER  ::::::::::* //

    // *:::::::::::  SETTER  ::::::::::* //
    // ?----------   OWNER   -----------? //

    function createFeature(
        uint16 _estimatedDays,
        uint256 _wadge,
        string memory _description,
        address _assignedWorker,
        bool _isInviteOnly
    ) internal view returns (Feature memory) {
        if (_isInviteOnly) {
            require(_assignedWorker != address(0), "You must assign a worker");
        }
        require(
            _estimatedDays > 0,
            "You must set a estimatedDays greater than 0"
        );
        require(_wadge > 0, "You must set a wadge greater than 0");
        require(bytes(_description).length > 0, "You must set a description");

        Feature memory _newFeature;

        _newFeature.oppenedAt = block.timestamp;
        _newFeature.estimatedDays = _estimatedDays;
        _newFeature.wadge = _wadge;
        _newFeature.assignedWorker = _assignedWorker;
        _newFeature.description = _description;
        _newFeature.isInviteOnly = _isInviteOnly;

        return _newFeature;
    }

    function createFeatureWeb3(
        uint16 _estimatedDays,
        uint256 _wadge,
        string memory _description,
        address _assignedWorker,
        bool _isInviteOnly,
        address _addrOwner
    ) internal view returns (FeatureWeb3 memory) {
        if (_isInviteOnly) {
            require(
                _assignedWorker != address(0),
                "You must assign a worker to this feature"
            );
        }
        require(
            _estimatedDays > 0,
            "You must set a estimatedDays greater than 0"
        );
        require(_wadge > 0, "You must set a wadge greater than 0");
        require(bytes(_description).length > 0, "You must set a description");
        FeatureWeb3 memory _newFeature;

        _newFeature.addrOwner = _addrOwner;
        _newFeature.feature.oppenedAt = block.timestamp;
        _newFeature.feature.estimatedDays = _estimatedDays;
        _newFeature.feature.wadge = _wadge;
        _newFeature.feature.assignedWorker = _assignedWorker;
        _newFeature.feature.description = _description;
        _newFeature.feature.isInviteOnly = _isInviteOnly;

        return _newFeature;
    }

    function _setFeature(
        uint16 _estimatedDays,
        uint256 _wadge,
        string memory _description,
        address _assignedWorker,
        bool _isInviteOnly
    ) internal view returns (Feature memory) {
        Feature memory _newFeature;
        _newFeature = createFeature(
            _estimatedDays,
            _wadge,
            _description,
            _assignedWorker,
            _isInviteOnly
        );
        return _newFeature;
    }

    function _setFeatureWeb3(
        uint _id,
        uint16 _estimatedDays,
        uint256 _wadge,
        string memory _description,
        address _assignedWorker,
        bool _isInviteOnly,
        address _addrOwner
    ) internal view returns (FeatureWeb3 memory) {
        FeatureWeb3 memory _newFeature = createFeatureWeb3(
            _estimatedDays,
            _wadge,
            _description,
            _assignedWorker,
            _isInviteOnly,
            _addrOwner
        );

        return _newFeature;
    }

    // // *:::::::::::  STATE  ::::::::::* //

    // function _setMissionStatusToPending() public {
    //     require(
    //         features.length > 0 || featuresWeb3.length > 0,
    //         "You must add at least one feature"
    //     );
    //     _changeMissionStatus(MissionStatus.Pending);
    // }
}
