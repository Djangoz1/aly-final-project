// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

import {DataTypes} from "../libraries/DataTypes.sol";
import {Bindings} from "../libraries/Bindings.sol";

import {IAccessControl} from "../interfaces/IAccessControl.sol";
import {IFactoryMission} from "../interfaces/IFactoryMission.sol";



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

    modifier onlyProxy(){
        require(msg.sender == address(accessControl), "Must call function with proxy bindings");
        _;
    }

    // *::::::::: ----------- :::::::::* //
    // *::::::::: CONSTRUCTOR :::::::::* //
    // *::::::::: ----------- :::::::::* //
    constructor(address _accessControl) {
        accessControl = IAccessControl(_accessControl);
        accessControl.setPubHub(address(this));
    }


    function getLength() external view returns(uint){
        return length;
    }


    function getIndexerByAddr(address _publisher) external view onlyProxy returns(uint[] memory) {
        require(indexerPub[_publisher].length > 0, "Have no publication");
        return indexerPub[_publisher];
    }


    function postPub(DataTypes.PubData memory _datas) external onlyProxy returns(address){
        address newPub = Bindings.deployPub(_datas, length);
        indexerPub[_datas.publisher].push(length);
        pub[length] = newPub;
        length ++;
        return newPub;
    }
}