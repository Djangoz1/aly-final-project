// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

import {DataTypes} from "../libraries/DataTypes.sol";
import {IAccessControl} from "../interfaces/IAccessControl.sol";

import {Bindings} from "../libraries/Bindings.sol";


contract PubHub is Ownable {
    uint length;
    // /**
    // * @dev storage indexer publications
    // * @param key address is for cv publisher
    // * @return array of index publications for each publisher 
    // */
    mapping(address => uint[]) indexerPub;

    // /**
    // * @dev storage all publications
    // * @param key uint is for index publication
    // * @return address publication 
    // */
    mapping(uint=> address) pub;



    IAccessControl accessControl;

    // *::::::::: CONSTRUCTOR :::::::::* //
    constructor(address _accessControl) {
        accessControl = IAccessControl(_accessControl);
        accessControl.setPubHub(address(this));
    }


    function getLength() public view returns(uint){
        return length;
    }


    function getIndexerByAddr(address _publisher) public view returns(uint[] memory) {
        require(indexerPub[_publisher].length > 0, "Have no publication");
        return indexerPub[_publisher];
    }

    function postPub(DataTypes.PubData memory _datas) public {
        address newPub = Bindings.deployPub(_datas);
        indexerPub[msg.sender].push(length);
        pub[length]= newPub;
        length ++;
    }
}