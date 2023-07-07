// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./FactoryCV.sol";

import "../lib/Milestone.sol";
import "../lib/CommitWorker.sol";
import "../Mission.sol";

import {CreateProfileData} from "../../../core/contracts/libraries/DataTypes.sol";

import {ILensHub} from "../../../core/contracts/interfaces/ILensHub.sol";

interface IntFactoryMission {
    function createMission(uint _amount) external returns (address);

    function getPrice() external view returns (uint256);
}

contract CV is Ownable {
    using Milestone for *;

    enum KycStatus {
        isKyc,
        isNotKyc
    }

    address factoryCV;
    address lensHubAddr;
    uint lensProfile;

    string public name;

    bool public isRegistred;
    bool isBanned;
    uint missionsLength;

    uint featuresLength;

    mapping(uint => address) public missionsList;
    mapping(uint => Milestone.Feature) public featuresList;
    mapping(uint => Milestone.FeatureWeb3) public featuresWeb3List;
    mapping(uint => CommitWorker.Commit) public commitsList;

    constructor(address _factoryCV, address _lensHubAddr) {
        factoryCV = _factoryCV;
        lensHubAddr = _lensHubAddr;
        ILensHub lensHub = ILensHub(lensHubAddr);
        require(
            address(lensHub) == lensHubAddr,
            "Something went wrong with lensHub"
        );

        lensHub.whitelistProfileCreator(msg.sender, bool);
        // Data
        CreateProfileData memory lensHubData;
        lensHubData.to = owner();
        lensHub.createProfile(lensHubData);
        isRegistred = true;
    }

    // *::::::::::::: FEATURES :::::::::::::* //

    function incrementFeatures(
        Milestone.Feature memory _newFeature
    ) public onlyOwner {
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

    function setName(string memory _name) public onlyOwner {
        require(bytes(_name).length > 0, "Name is empty");
        name = _name;
    }

    function beAssignedWorker(
        address _missionAddress,
        uint _idFeature
    ) public onlyOwner {
        Mission mission = Mission(_missionAddress);
        Milestone.Feature memory _newFeature = mission.beAssignedWorker(
            _idFeature
        );
        incrementFeatures(_newFeature);
    }

    function setMission(address _missionAddress) public {
        require(
            missionsList[missionsLength + 1] == address(0),
            "Mission already registred"
        );
        missionsList[missionsLength] = _missionAddress;
        missionsLength++;
    }

    function buyMission(
        address _factoryMission,
        uint _amount
    ) public onlyOwner {
        IntFactoryMission factoryMission = IntFactoryMission(_factoryMission);
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
