// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./CV.sol";
import {IAccessControl} from "../interfaces/IAccessControl.sol";

contract FactoryCV is Ownable {
    mapping(address => address) listCV;
    uint length;
    address[] listAddress;

    IAccessControl accessControl;



    constructor(address _accessControl){
        accessControl = IAccessControl(_accessControl);
        accessControl.setFactoryCV(address(this));
    }



    function createCV(address _owner) public returns (address) {
        require(listCV[_owner] == address(0), "Can't have more than 1");
        CV newCV = new CV(address(this));
        newCV.transferOwnership(_owner);
        listCV[_owner] = address(newCV);
        listAddress.push(_owner);
        length++;
        return address(newCV);
    }

    function getCVsLength() public view returns (uint) {
        return length;
    }

    function getCV(address _address) public view returns (address) {
        CV cv = CV(listCV[_address]);
        require(cv.isRegistred(), "CV not found");
        return address(listCV[_address]);
    }

    function getCVById(uint _id)public view returns(address){
        address _address = listAddress[_id];
        return listCV[_address];
    }


    
}
