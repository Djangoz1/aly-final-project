// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./CV.sol";
import {IAccessControl} from "../interfaces/IAccessControl.sol";
import {Bindings} from "../libraries/Bindings.sol";

contract FactoryCV is Ownable {

    /**
    *   @notice address of owner cv
    *   @notice id of cv
    */
    mapping(address => uint) listIndexer;

    /**
    *   @notice id of cv
    *   @notice cv address
    */
    mapping(uint => address) listCV;

    /**
    *   @dev length of listCV. Need it to track forks of listCV
    */
    uint length;

    /**
    *   @dev instance of access control
    *   @notice access control is the path to call all major protocol functions
    */
    IAccessControl accessControl;


    modifier onlyProxy(){
        require(msg.sender == address(accessControl), "Must call function with proxy bindings");
        _;
    }


    constructor(address _accessControl){
        accessControl = IAccessControl(_accessControl);
        accessControl.setFactoryCV(address(this));
        address genesis = Bindings._deployCV(address(this), address(this), length);
        listIndexer[address(this)] = length;
        listCV[listIndexer[address(this)]] = genesis;
        length ++;
    }



    /**
    * @param _toAddr is address of owner's newCV
    * @return newCV address is new cv for _toAddr
    */
    function createCV(address _toAddr) public onlyProxy returns (address) {
        require(listIndexer[_toAddr] == 0, "Already have a cv");
        require(listCV[length] == address(0), "Missmatch index on listCV");
        address newCV = Bindings._deployCV(_toAddr, address(this), length);
        listIndexer[_toAddr] = length;
        listCV[listIndexer[_toAddr]] = newCV;
        length++;
        return newCV;
    }

    function getCVsLength() public view returns (uint) {
        return length;
    }


    function checkRegistred(address _forAddr) external view  {
        _checkRegistred(_forAddr);
    }
    function _checkRegistred(address _forAddr) internal view  {
        require(listIndexer[_forAddr] != 0, "CV not found");
    }




    /**
    * @param _forAddr address of owner cv
    * @return cv address of owner cv
    * @notice must to pass through listIndexer && listCV to fetch cv
    */
    function getCVByAddress(address _forAddr) external view  onlyProxy returns (address) {
        _checkRegistred(_forAddr);
        require(listCV[listIndexer[_forAddr]] != address(0), "Missmatch index on listCV");
        return listCV[listIndexer[_forAddr]];
    }

    /**
    * @param _id cv on listCV
    * @return cv address
    * @notice can fetch cv directly on list cv
    */
    
    function getCVById(uint _id)public view onlyProxy returns(address){
        require(_id < length, "ID out of range");
        return listCV[_id];
    }


    
}
