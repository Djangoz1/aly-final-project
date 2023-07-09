// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";


import {DataTypes} from "./libraries/DataTypes.sol";
import {DataRecast} from "./libraries/DataRecast.sol";
import {IPub} from "./interfaces/IPub.sol";




contract Pub is Ownable, IPub{

    uint id;

    
    DataTypes.PubType pubType;
    string metadata;

    constructor(DataTypes.PubData memory _datas, uint _id ){
        id = _id;
        setMetadata(_datas);
    }

    function setMetadata(DataTypes.PubData memory _datas) internal onlyOwner{
        metadata = DataRecast.castPubMetadata(_datas);
    }

    function getMetadata() external view returns(string memory) {
        return metadata;
    }

}