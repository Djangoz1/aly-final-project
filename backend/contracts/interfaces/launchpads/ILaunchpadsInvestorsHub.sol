// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {DataTypes} from "../../libraries/DataTypes.sol";

interface ILaunchpadsInvestorsHub {
    function datasOf(
        uint _launchpadID,
        address _investor
    ) external view returns (DataTypes.InvestorData memory);

    /**
     * @param _launchpadID is ID of invested launchpad
     * @param _tierID is ID of current tier ID
     * @param _from is sender of value
     * @param _value is msg.value of sender
     */
    function _investOnLaunchpad(
        uint _launchpadID,
        uint _tierID,
        address _from,
        uint _value
    ) external payable returns (bool);
}
