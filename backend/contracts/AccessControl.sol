// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

import {DataTypes} from "./libraries/DataTypes.sol";
import {IAccessControl} from "./interfaces/IAccessControl.sol";
import {IFactoryMission} from "./interfaces/IFactoryMission.sol";
import {IPubHub} from "./interfaces/IPubHub.sol";
import {IFactoryCV} from "./interfaces/IFactoryCV.sol";

contract AccessControl is Ownable {

    uint cvPrice = 100;

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


    // *::::::::::::::: -------------- :::::::::::::::* //
    // *::::::::::::::: Initialisation :::::::::::::::* //
    // *::::::::::::::: -------------- :::::::::::::::* //
    


    function setPubHub(address _pubHub) external onlyStart {
        iPH = IPubHub(_pubHub);
        if(hasInit()){
            workflow = DataTypes.AccessControlStatus.Init;
        }
    }

    function getPubHub() external returns(address){
        address pubHubAddr = address(iPH);
        return pubHubAddr;
    }

    function setFactoryCV(address _factoryCV) external onlyStart  {
        iFCV = IFactoryCV(_factoryCV);
        if(hasInit()){
            workflow = DataTypes.AccessControlStatus.Init;
        }
    }
    
    function getFactoryCV() external onlyStart returns(address){
        return address(iFCV);
    }

    function setFactoryMission(address _factoryMission) external onlyStart{
        iFMI = IFactoryMission(_factoryMission);
        if(hasInit()){
            workflow = DataTypes.AccessControlStatus.Init;
        }
    }

    function getFactoryMission() external onlyStart returns(address){
        return address(iFMI);
    }

    // *::::::::::::::: ----------- :::::::::::::::* //
    // *::::::::::::::: CV BINDINGS :::::::::::::::* //
    // *::::::::::::::: ----------- :::::::::::::::* //

    /**
    * @notice This function can called only one time per address
    * @dev Second call will be reverted by iFCV.createCV(_owner) because sender have already CV
    * @return address target deployment cv
    */
    function buyCV() external payable onlyInit returns(address){
        require(msg.value > cvPrice, "Value must be greater than price");
        address newCV = iFCV.createCV(msg.sender);
        return newCV;
    }

    /**
    * @param _addr owner of cv
    * @return address of cv
    */
    function getCVByAddress(address _addr) external view onlyInit returns(address) {
        return iFCV.getCVByAddress(_addr);
    }

    // *::::::::::::::: ------------ :::::::::::::::* //
    // *::::::::::::::: PUB BINDINGS :::::::::::::::* //
    // *::::::::::::::: ------------ :::::::::::::::* //

    function createPub(DataTypes.PubData memory _datas) external onlyInit returns(address){
        iFCV.checkRegistred(msg.sender);
        iPH.postPub(_datas);
        // return newPub;
    }

    function getPubIndexers(address _addr)external onlyInit returns(uint[] memory){
        iFCV.checkRegistred(_addr);
        uint[] memory indexer = iPH.getIndexerByAddr(_addr);
        return indexer;
    }

}