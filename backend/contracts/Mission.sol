// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

// import "./CV.sol";

// import "./SBToken/FactoryCV.sol";
import "./WorkflowStatusManager.sol";

import "./libraries/Milestone.sol";
import "./libraries/CommitWorker.sol";
import "./SBToken/FactoryCV.sol";


import {DataTypes} from "./libraries/DataTypes.sol";
import {IMission} from "./interfaces/IMission.sol";



contract Mission is WorkflowStatusManager, IMission {
    using CommitWorker for *;
    using Milestone for *;
    using Counters for Counters.Counter;
    FactoryCV public factoryCV;
    address public factoryCVaddress;
    address public factoryMissionAddress;

    uint public cvId;



    mapping(address => address) followers;

    DataTypes.MissionData profile;



    Milestone.Feature[] public features;
    Milestone.FeatureWeb3[] public featuresWeb3;
    mapping(uint => CommitWorker.Commit[]) commits;
    //  commits related to this feature (commitId => featureId)

    uint globalWadge;

    // ********************************** //
    // *::::::::::: MODIFIERS ::::::::::* //
    // ---------------------------------- //

    modifier onlyWorker(uint _id) {
        //! address cv = getCV(msg.sender);
        // require(cv != address(0), "You must have a CV to be a worker");
        require(_id < features.length, "Feature not found");
        require(
            features[_id].assignedWorker == msg.sender,
            "Only assigned worker can call this function"
        );
        _;
    }

    modifier onlyFeatureOpen(uint256 _id) {
        // require(missionStatus == MissionStatus.Pending, "Mission is not open");
        require(_id < features.length, "Feature not found");
        require(features[_id].status == Milestone.FeatureStatus.Pending, "Feature is not open");
        require(features[_id].isDone == false, "Feature is already done");
        _;
    }

    //! modifier onlyEmployer() {
    //     require(getCV(msg.sender, factoryCVaddress) == owner(), "Only employer can call this function");
    //     _;
    // }

    //! modifier onlyWorkerOrOwner(uint _id) {
    //     require(features[_id].assignedWorker == msg.sender || msg.sender == owner(),"Only workers or owner can call this function");
    //     _;
    // }

    // *:::::::::  -----------  ::::::::* //
    // *:::::::::  CONSTRUCTOR  ::::::::* //
    // *:::::::::  -----------  ::::::::* //
    

    constructor( address _ownerCV, uint _id) {
        transferOwnership(_ownerCV);
        factoryMissionAddress = msg.sender;
        cvId = _id;
    }

    // *:::::::::::: EMPLOYER ::::::::::::* //

    function incrementFollower() external{
        require(followers[msg.sender] == address(0), "Already followed");
        DataTypes.MissionData  storage _profile = profile;
        followers[msg.sender] = msg.sender;
        _profile.followersLength ++;
        
        profile = _profile;
    }




    // function getCV(
    //     address _addr,
    //     address _factoryCVAddr
    // ) public view returns (address) {
    //     FactoryCV factoryCV = FactoryCV(_factoryCVAddr);
    //     address cvAddr = factoryCV.getCV(_addr);
    //     return cvAddr;
    // }

    function getFeature(
        uint256 _id
    ) public view returns (Milestone.Feature memory) {
        require(_id < features.length, "Feature not found");
        return features[_id];
    }

    function getFeatureWeb3(
        uint256 _id
    ) public view returns (Milestone.FeatureWeb3 memory) {
        require(_id < featuresWeb3.length, "Feature not found");
        return featuresWeb3[_id];
    }

    function getFeaturesLength() public view returns (uint256) {
        return features.length;
    }

    function getFeaturesWeb3Length() public view returns (uint256) {
        return featuresWeb3.length;
    }

    function setFeature(
        uint16 _estimatedDays,
        uint256 _wadge,
        string memory _description,
        address _assignedWorker,
        bool _isInviteOnly
    //! ) public onlyEmployer {
    ) public {
        Milestone.Feature memory _newFeature = Milestone._setFeature(
            _estimatedDays,
            _wadge,
            _description,
            _assignedWorker,
            _isInviteOnly
        );
        _newFeature.id = features.length;
        features.push(_newFeature);
    }

    function setFeatureWeb3(
        uint16 _estimatedDays,
        uint256 _wadge,
        string memory _description,
        address _assignedWorker,
        bool _isInviteOnly,
        address _addrOwner
    ) public onlyOwner {
        Milestone._setFeatureWeb3(
            featuresWeb3.length - 1,
            _estimatedDays,
            _wadge,
            _description,
            _assignedWorker,
            _isInviteOnly,
            _addrOwner
        );
    }

    // *::::::::::::: WORKER :::::::::::::* //

    function addAssignedWorker(
        bool _isWeb3,
        uint256 _id,
        address _assignedWorker
    ) public onlyOwner onlyFeatureOpen(_id) {
        require(_assignedWorker != address(0), "Unvalid address");
        if (_isWeb3) {
            require(_id < featuresWeb3.length, "Feature not found");
            featuresWeb3[_id].feature.assignedWorker = _assignedWorker;
        } else {
            require(_id < features.length, "Feature not found");
        }
        CommitWorker.Commit memory _newCommit = CommitWorker._createCommit(
            _assignedWorker
        );

        commits[_id].push(_newCommit);
    }

    function beAssignedWorker(
        uint _id
    ) public returns (Milestone.Feature memory) {
        require(_id < features.length, "Feature not found");
        require(
            features[_id].isInviteOnly == false,
            "This feature is invite only"
        );
        require(
            features[_id].assignedWorker == address(0),
            "This feature already has a worker assigned"
        );
        Milestone.Feature memory _updatedFeature = features[_id];
        _updatedFeature.assignedWorker = msg.sender;
        _updatedFeature.commitLength += 1;

        CommitWorker.Commit memory _newCommit = CommitWorker._createCommit(
            msg.sender
        );
        commits[_id].push(_newCommit);
        features[_id] = _updatedFeature;
        return _updatedFeature;
    }

    // !function beAssignedWorkerWeb3(uint _id) public {
    //     require(_id < featuresWeb3.length, "Feature not found");
    //     require(
    //         featuresWeb3[_id].feature.isInviteOnly == false,
    //         "This feature is invite only"
    //     );
    //     require(
    //         featuresWeb3[_id].feature.assignedWorker == address(0),
    //         "This feature already has a worker assigned"
    //     );
    //     CommitWorker._beAssignedWorkerWeb3(_id);
    // }

    function createCommit(address _assignedWorker, uint _id) public {
        features[_id].commitLength++;
        features[_id].assignedWorker = _assignedWorker;
        CommitWorker.Commit memory _newCommit = CommitWorker._createCommit(
            _assignedWorker
        );
        commits[_id].push(_newCommit);
    }
}
