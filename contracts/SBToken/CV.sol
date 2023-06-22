// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import './FactoryCV.sol';
import "../Mission.sol";
import "../lib/Milestone.sol";
import "../lib/CommitWorker.sol";
contract CV is Ownable{
    using Milestone for *;

    enum KycStatus {isKyc, isNotKyc}

    string public name;
       
    bool isRegistred;
    bool isBanned;
    
    mapping(address => bool) public missionsList;
    mapping(uint => Milestone.Feature) public featuresList;
    mapping(uint => Milestone.FeatureWeb3) public featuresWeb3List;
    mapping(uint => CommitWorker.Commit) public commitsList;

    constructor(){
        isRegistred = true;
    }

  

    function setMission(address _missionAddress) public onlyOwner {
        require(missionsList[_missionAddress] == false , "Mission already registred");
            missionsList[_missionAddress] = true;
    }
    
    function getMission(address _missionAddress) public view returns (Mission) {
        require(isRegistred == true, "You must be registred");
        if(missionsList[_missionAddress] != true){
            revert("You must be registred in this mission");
        }else{
            Mission mission = Mission(_missionAddress);
            return mission;
        }
    }

}