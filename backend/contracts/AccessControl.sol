// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

import {DataTypes} from "./libraries/DataTypes.sol";
import {IAccessControl} from "./interfaces/IAccessControl.sol";

contract AccessControl is Ownable {

    address public FactoryMission;
    address public FactoryCV;
    address public PubHub;

    DataTypes.AccessControlStatus public status;

    modifier onlyInit(){
        require(status == DataTypes.AccessControlStatus.Init, "Init is not ready");
        _;
    }

    function hasInit()internal view returns(bool){
        if(FactoryMission != address(0) && FactoryCV != address(0) && PubHub != address(0) ){
            return true;
        }else {
            return false;
        }
    }

    modifier onlyStart(){
        require(status == DataTypes.AccessControlStatus.Initialization, "Init is not ready");
        require(PubHub != address(0) && FactoryCV != address(0) && FactoryMission != address(0), "Already init");
        _;
    }

    function setPubHub(address _pubHub) external onlyStart {
        PubHub = _pubHub;
        if(hasInit()){
            status = DataTypes.AccessControlStatus.Init;
        }
    }

    function setFactoryCV(address _factoryCV) external onlyStart  {
        PubHub = _factoryCV;
        if(hasInit()){
            status = DataTypes.AccessControlStatus.Init;
        }
    }

    function setFactoryMission(address _factoryMission) external onlyStart{
        FactoryMission = _factoryMission;
        if(hasInit()){
            status = DataTypes.AccessControlStatus.Init;
        }
    }

    function hasCVAllowance(address _addr) external onlyInit {

    }
}