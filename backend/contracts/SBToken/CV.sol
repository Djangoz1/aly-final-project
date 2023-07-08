// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
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







contract CV is Ownable {
    using Milestone for *;

    enum KycStatus {
        isKyc,
        isNotKyc
    }

    address public factoryCV;
    


    /**
    *    @dev string name string imgURI, address[] posts, uint followers, address[] followAccounts, address[] followMissions
    */
    DataTypes.ProfileData profile;




    bool public isRegistred;
    bool isBanned;
    uint missionsLength;

    uint featuresLength;

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

    constructor(address _factoryCV) {
        isRegistred = true;
        DataTypes.ProfileData memory defaultData;
        factoryCV = _factoryCV;
        profile = defaultData;
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
    function followMission(address _toFollow) public onlyByOwner {
        require(_toFollow != address(0),"Should follow value address");
        InteractionLogic._followMission(_toFollow, profile.followMissions);
        profile.followMissions.push(_toFollow);
    }
    function unfollowMission(address _toUnfollow) internal {}

    function postPub(DataTypes.PubData memory _datas) external onlyOwner{
        address _newPub = Bindings.deployPub(_datas);
        profile.posts.push(_newPub);
    }





    function setName(string memory _name) public onlyOwner {
        require(bytes(_name).length > 0, "Name is empty");
        profile.name = _name;
    }


    // *:::::::::::: -------- ::::::::::::* //
    // *:::::::::::: FEATURES ::::::::::::* //
    // *:::::::::::: -------- ::::::::::::* //




    function incrementFeatures(Milestone.Feature memory _newFeature) public onlyOwner {
        featuresList[featuresLength] = _newFeature;
        featuresLength++;
    }

    function getFeaturesLength() public view returns (uint) {
        return featuresLength;
    }

    function getFeature(
        uint _id
    ) public view returns (Milestone.Feature memory) {
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
            missionsList[missionsLength] == address(0),
            "Mission already registred"
        );
        address _toFollow = InteractionLogic._followMission(_missionAddress, profile.followMissions);
        profile.followMissions.push(_toFollow);
        missionsList[missionsLength] = _missionAddress;
        missionsLength++;
    }

    function buyMission(
        address _factoryMission,
        uint _amount
    ) public onlyOwner {
        IFactoryMission factoryMission = IFactoryMission(_factoryMission);
        uint price = factoryMission.getPrice();
        price += _amount;
        factoryMission.createMission(price);
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
        return missionsLength;
    }
}
