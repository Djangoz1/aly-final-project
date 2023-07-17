// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

// import {DataTypes} from "./libraries/DataTypes.sol";
// import {IAccessControl} from "./interfaces/IAccessControl.sol";

interface ILaunchpad {
    function setLaunchpadInvestor(address _launchpadInvestor) external;
}
