// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

import {DataTypes} from "./libraries/DataTypes.sol";
import {IAccessControl} from "./interfaces/IAccessControl.sol";
import {IFactoryMission} from "./interfaces/IFactoryMission.sol";
import {IPubHub} from "./interfaces/IPubHub.sol";
import {IFactoryCV} from "./interfaces/IFactoryCV.sol";

contract AccessControl is Ownable {

    IFactoryMission public iFMI;
    IFactoryCV public iFCV;
    IPubHub public iPH;

    DataTypes.AccessControlStatus public workflow;

    modifier onlyInit(){
        require(workflow == DataTypes.AccessControlStatus.Init, "Init is not ready");
        _;
    }

    function hasInit()internal view returns(bool){
        if(address(iFMI) != address(0) && address(iFCV) != address(0) && address(iPH) != address(0) ){
            return true;
        }else {
            return false;
        }
    }

    

    modifier onlyStart(){
        require(workflow == DataTypes.AccessControlStatus.Initialization, "Init is not ready");
        _;
    }

    function setPubHub(address _pubHub) external onlyStart {
        iPH = IPubHub(_pubHub);
        if(hasInit()){
            workflow = DataTypes.AccessControlStatus.Init;
        }
    }

    function setFactoryCV(address _factoryCV) external onlyStart  {
        iFCV = IFactoryCV(_factoryCV);
        if(hasInit()){
            workflow = DataTypes.AccessControlStatus.Init;
        }
    }

    function setFactoryMission(address _factoryMission) external onlyStart{
        iFMI = IFactoryMission(_factoryMission);
        if(hasInit()){
            workflow = DataTypes.AccessControlStatus.Init;
        }
    }

    function getCVByAddress(address _addr) external onlyInit returns(address) {
        return iFCV.getCVByAddress(_addr);
    }
}