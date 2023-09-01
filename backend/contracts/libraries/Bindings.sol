// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import {DataTypes} from "../libraries/DataTypes.sol";

import {ICVHub} from "../interfaces/ICVHub.sol";

library Bindings {
    function getCV(address _for, address _cvHub) internal view returns (uint) {
        ICVHub iCVH = ICVHub(_cvHub);
        return iCVH.getCV(_for);
    }

    // Ajoutez votre code ici
}
