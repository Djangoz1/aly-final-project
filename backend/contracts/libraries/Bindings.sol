// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

import {DataTypes} from "./DataTypes.sol";
import {IPub} from "../interfaces/IPub.sol";
import {IAccessControl} from "../interfaces/IAccessControl.sol";
import {Pub} from "../Pub.sol";

library Bindings {
    



    function deployPub(DataTypes.PubData memory _datas) internal returns(address){
        Pub pub = new Pub(_datas);
        return address(pub);
    }
}