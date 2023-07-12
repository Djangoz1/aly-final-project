// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import {CV} from "../SBToken/CV.sol";
import {DataTypes} from "./DataTypes.sol";

import {IFactoryCV} from "../interfaces/IFactoryCV.sol";
import {ICV} from "../interfaces/ICV.sol";
import {IAccessControl} from "../interfaces/IAccessControl.sol";

library Bindings {
    function _deployCV(
        address _toAddr,
        address factoryCV,
        uint _id
    ) internal returns (address) {
        CV newCV = new CV(factoryCV, _id);
        newCV.transferOwnership(_toAddr);
        return address(newCV);
    }
}
