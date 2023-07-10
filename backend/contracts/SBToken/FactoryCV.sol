// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./CV.sol";
import {IAccessControl} from "../interfaces/IAccessControl.sol";
import {Bindings} from "../libraries/Bindings.sol";

contract FactoryCV is Ownable {
    using Counters for Counters.Counter;

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
    *   @dev _cvIds of listCV. Need it to track forks of listCV
    */
    Counters.Counter private _cvIds;
    


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
        address genesis = Bindings._deployCV(address(this), address(this), _cvIds.current());
        listIndexer[address(this)] = _cvIds.current();
        listCV[listIndexer[address(this)]] = genesis;
        _cvIds.increment();
    }



    /**
    * @param _toAddr is address of owner's newCV
    * @return newCV address is new cv for _toAddr
    */
    function createCV(address _toAddr) public onlyProxy returns (address) {
        require(listIndexer[_toAddr] == 0, "Already have a cv");
        require(listCV[_cvIds.current()] == address(0), "Missmatch index on listCV");
        address newCV = Bindings._deployCV(_toAddr, address(this), _cvIds.current());
        listIndexer[_toAddr] = _cvIds.current();
        listCV[listIndexer[_toAddr]] = newCV;
        _cvIds.increment();
        return newCV;
    }

    function getCvIds() public view returns (uint) {
        return _cvIds.current();
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
        require(_id < _cvIds.current(), "ID out of range");
        return listCV[_id];
    }


    
}
