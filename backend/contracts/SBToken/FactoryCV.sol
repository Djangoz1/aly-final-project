// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./CV.sol";
import {IAccessControl} from "../interfaces/IAccessControl.sol";

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
    }




    function createCV(address _owner) public returns (address) {
        require(listCV[length] == address(0), "Missmatch index in listCV");
        CV newCV = new CV(address(this));
        newCV.transferOwnership(_owner);

        listIndexer[_owner] = length;
        listCV[listIndexer[_owner]] = address(newCV);
        

        length++;
        return address(newCV);
    }

    function getCVsLength() public view returns (uint) {
        return length;
    }


    /**
    * @param _ownerCV address of owner cv
    * @return cv address of owner cv
    * @notice must to pass through listIndexer && listCV to fetch cv
    */

    function getCVByAddress(address _ownerCV) external view  onlyProxy returns (address) {
        require(listIndexer[_ownerCV] != 0, "CV not found");
        require(listCV[listIndexer[_ownerCV]] != address(0), "Missmatch index in listCV");
        return listCV[listIndexer[_ownerCV]];
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
