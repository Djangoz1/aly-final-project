// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

// import "@openzeppelin/contracts/access/Ownable.sol";

import "./WorkflowStatusManager.sol";
import './lib/Milestone.sol';
// import './lib/CVLib.sol';
import './SBToken/FactoryCV.sol';
// import './Mission.sol';




contract Employer is WorkflowStatusManager   {
    using Milestone for *;
    Milestone.Feature[] public features;
    Milestone.FeatureWeb3[] public featuresWeb3;
    // using CVLib for *;
    address public factoryCVaddress;
    FactoryCV public factoryCV;


    function getCV (address _addr, address _factoryCVAddr)public view returns (address){
        FactoryCV factoryCV = FactoryCV(_factoryCVAddr);
        address cvAddr = factoryCV.getCV(_addr);
        return cvAddr;
    }

    modifier onlyFeatureOpen(uint256 _id) {
        // require(missionStatus == MissionStatus.Pending, "Mission is not open");
        require(_id < Employer.features.length, "Feature not found");
        require(Employer.features[_id].status == Milestone.FeatureStatus.Pending,"Feature is not open");
        require(Employer.features[_id].isDone == false, "Feature is already done");
        _;
    }


    modifier onlyEmployer() {

        require(getCV(msg.sender, factoryCVaddress) == owner(), "Only employer can call this function");
        _;
    }

     // ********************************** //
    // *:::::::::::  GETTER  ::::::::::* //
    // ---------------------------------- //

    function getFeature(uint256 _id) public view returns (Milestone.Feature memory) {
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

    // ********************************** //
    // *:::::::::::  SETTER  ::::::::::* //
    // ---------------------------------- //
    // ?----------   OWNER   -----------? //



    function setFeature(
        uint16 _estimatedDays,
        uint256 _wadge,
        string memory _description,
        address _assignedWorker,
        bool _isInviteOnly
    ) public onlyEmployer  {

        Milestone.Feature memory _newFeature;
        _newFeature = Milestone.createFeature(_estimatedDays, _wadge, _description, _assignedWorker, _isInviteOnly);
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
    ) public onlyOwner  {
        
        Milestone.FeatureWeb3 memory _newFeature;
        _newFeature = Milestone.createFeatureWeb3(_estimatedDays, _wadge, _description, _assignedWorker, _isInviteOnly, _addrOwner);
        _newFeature.id = featuresWeb3.length;
        featuresWeb3.push(_newFeature);
    }

    function setMissionStatusToPending() public onlyOwner  {
        require(features.length > 0 || featuresWeb3.length > 0, "You must add at least one feature");
        _changeMissionStatus(MissionStatus.Pending);
    }


}