// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {DataTypes} from "../libraries/DataTypes.sol";

interface ICV {
    function getProfile() external  view returns (DataTypes.ProfileData memory);
    
}
