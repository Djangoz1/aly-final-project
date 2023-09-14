// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {DataTypes} from "../libraries/DataTypes.sol";

interface IContract {
    function getTokensLength() external view returns (uint);
    // Ajoutez votre code ici
}
