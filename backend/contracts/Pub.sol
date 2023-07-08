// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";


import {DataTypes} from "./libraries/DataTypes.sol";
import {DataRecast} from "./libraries/DataRecast.sol";
import {IPub} from "./interfaces/IPub.sol";




contract Pub is Ownable, IPub{
    // /**
    // *    @param Social when publisher post on global access
    // *    @param Work when publisher post on followers mission access
    // *    @param Feed when publisher post on paid access
    // *    @param Private when publisher post for a whitelisted address
    // */
    DataTypes.PubType pubType;
    
    // /**
    // *    @dev string title, string content, address publisher, uint followers
    // *    @param title
    // *    @param content
    // *    @param imgURI
    // *    @param publisher
    // *    @param followers
    // */

    // DataTypes.PubData informations;


    string metadata;

    constructor(DataTypes.PubData memory _datas){
        setMetadata(_datas);
    }

    function setMetadata(DataTypes.PubData memory _datas) internal onlyOwner{
        metadata = DataRecast.castPubMetadata(_datas);
    }

    function getMetadata() external view returns(string memory) {
        return metadata;
    }

}