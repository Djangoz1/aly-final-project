// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./FactoryCV.sol";

import "../libraries/Milestone.sol";
import "../libraries/CommitWorker.sol";
import "../Mission.sol";
import {IMission} from "../interfaces/IMission.sol";
import {IFactoryMission} from "../interfaces/IFactoryMission.sol";
import {IFactoryMission} from "../interfaces/IFactoryMission.sol";

import {Bindings} from "../libraries/Bindings.sol";
import {DataTypes} from "../libraries/DataTypes.sol";
import {DataRecast} from "../libraries/DataRecast.sol";
import {InteractionLogic} from "../libraries/InteractionLogic.sol";

import "@openzeppelin/contracts/utils/Counters.sol";






contract CV is Ownable {
    using Milestone for *;
    using SafeMath for uint256;
    using Counters for Counters.Counter;

    enum KycStatus {
        isKyc,
        isNotKyc
    }

    address public factoryCV;
    
    uint public id;

    /**
    *    @dev string name string imgURI, address[] posts, uint followers, address[] followAccounts, address[] followMissions
    */
    DataTypes.ProfileData profile;




    bool public isRegistred;
    bool isBanned;



    Counters.Counter private _missionIds;

    Counters.Counter private _featureIds;

    mapping(uint => address) public missionsList;
    mapping(uint => Milestone.Feature) public featuresList;
    mapping(uint => Milestone.FeatureWeb3) public featuresWeb3List;
    mapping(uint => CommitWorker.Commit) public commitsList;




    modifier onlyByOwner (){
        require(msg.sender == owner() || msg.sender == address(this), "Caller is not part of owner");
        _;
    }

    modifier onlyFactoryMision(){
        address _factoryCV = IFactoryMission(msg.sender).getFactoryCV();
        require(_factoryCV == factoryCV, "Not right to set");
        _;
    }

    constructor(address _factoryCV, uint _id) {
        factoryCV = _factoryCV;
        id = _id;
        isRegistred = true;
    }
   
    // *:::::::::::: -------- ::::::::::::* //
    // *:::::::::::: Profile :::::::::::::* //
    // *:::::::::::: -------- ::::::::::::* //


    function getProfile() external  view returns (DataTypes.ProfileData memory){
        return profile;
    }

    /**
     * @notice This function called by function setMission
     * @param _toFollow address mission want following
    */
    function followMission(address _toFollow) external onlyByOwner {
        require(_toFollow != address(0),"Should follow value address");
        InteractionLogic._followMission(_toFollow, profile.followMissions);
        profile.followMissions.push(_toFollow);
    }
    function unfollowMission(address _toUnfollow) external {}

    




    function setName(string memory _name) external onlyOwner {
        require(bytes(_name).length > 0, "Name is empty");
        profile.name = _name;
    }


    // *:::::::::::: -------- ::::::::::::* //
    // *:::::::::::: FEATURES ::::::::::::* //
    // *:::::::::::: -------- ::::::::::::* //




    function incrementFeatures(Milestone.Feature memory _newFeature) external onlyOwner {
        featuresList[_featureIds.current()] = _newFeature;
        _featureIds.increment();
    }

    function getFeaturesLength() external view returns (uint) {
        return _featureIds.current();
    }

    function getFeature(
        uint _id
    ) external view returns (Milestone.Feature memory) {
        return featuresList[_id];
    }


    // function beAssignedWorker(
    //     address _missionAddress,
    //     uint _idFeature
    // ) public onlyOwner {
    //     Mission mission = Mission(_missionAddress);
    //     Milestone.Feature memory _newFeature = mission.beAssignedWorker(
    //         _idFeature
    //     );
    //     incrementFeatures(_newFeature);
    // }

    function setMission(address _missionAddress) external onlyFactoryMision{
        require(
            missionsList[_missionIds.current()] == address(0),
            "Mission already registred"
        );
        address _toFollow = InteractionLogic._followMission(_missionAddress, profile.followMissions);
        profile.followMissions.push(_toFollow);
        missionsList[_missionIds.current()] = _missionAddress;
        _missionIds.increment();
    }

 
    function getMission(uint _idMission) public view returns (address) {
        require(isRegistred == true, "You must be registred");
        require(
            missionsList[_idMission] != address(0),
            "You must be registred in this mission"
        );

        address mission = missionsList[_idMission];
        return mission;
    }

    function getMissionsLength() public view returns (uint) {
        return _missionIds.current();
    }
}
