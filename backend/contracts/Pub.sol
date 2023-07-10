// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

import {DataTypes} from "./libraries/DataTypes.sol";
import {DataRecast} from "./libraries/DataRecast.sol";
import {IPub} from "./interfaces/IPub.sol";

contract Pub is Ownable {
    uint public id;

    DataTypes.PubType pubType;
    DataTypes.PubData  metadata;

    constructor(DataTypes.PubData memory _datas, uint _id) {
        id = _id;
        metadata = _datas;
        transferOwnership(_datas.publisher);
        require(
            _datas.publisher == owner(),
            "Missmatch owner and publisher address"
        );
    }


    function getMetadata() external view returns (DataTypes.PubData memory) {
        return metadata;
    }
}
