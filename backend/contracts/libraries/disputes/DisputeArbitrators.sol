// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

import "@openzeppelin/contracts/utils/math/SafeMath.sol";

// import {DataTypes} from "./DataTypes.sol";
// import {IAccessControl} from "../../interfaces/IAccessControl.sol";
import {IAddressHub} from "../../interfaces/IAddressHub.sol";
import {ICVHub} from "../../interfaces/ICVHub.sol";
import {IArbitratorsHub} from "../../interfaces/IArbitratorsHub.sol";
import {IEscrowDatasHub} from "../../interfaces/IEscrowDatasHub.sol";
import {DisputeTools} from "./DisputeTools.sol";
import {Bindings} from "../../libraries/Bindings.sol";

library DisputeArbitrators {
    // Ajoutez votre code ici
    enum Status {
        None,
        Invited,
        Refused,
        Accepted
    }
}
