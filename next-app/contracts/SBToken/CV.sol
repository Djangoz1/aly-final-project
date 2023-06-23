// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./FactoryCV.sol";

import "../lib/Milestone.sol";
import "../lib/CommitWorker.sol";

contract CV is Ownable {
    using Milestone for *;

    enum KycStatus {
        isKyc,
        isNotKyc
    }

    string public name;

    bool public isRegistred;
    bool isBanned;
    uint missionsLength;
    mapping(uint => address) public missionsList;
    mapping(uint => Milestone.Feature) public featuresList;
    mapping(uint => Milestone.FeatureWeb3) public featuresWeb3List;
    mapping(uint => CommitWorker.Commit) public commitsList;

    constructor() {
        isRegistred = true;
    }

    function setName(string memory _name) public onlyOwner {
        require(bytes(_name).length > 0, "Name is empty");
        name = _name;
    }

    function setMission(address _missionAddress) public {
        require(
            missionsList[missionsLength + 1] == address(0),
            "Mission already registred"
        );
        missionsLength++;
        missionsList[missionsLength] = _missionAddress;
    }

    function getMission(uint _idMission) public view returns (address) {
        require(isRegistred == true, "You must be registred");
        if (missionsList[_idMission] == address(0)) {
            revert("You must be registred in this mission");
        } else {
            address mission = missionsList[_idMission];
            return mission;
        }
    }

    function getMissionsLength() public view returns (uint) {
        return missionsLength;
    }
}
