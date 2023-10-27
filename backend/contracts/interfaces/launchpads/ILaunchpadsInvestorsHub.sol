// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {DataTypes} from "../../libraries/DataTypes.sol";

interface ILaunchpadsInvestorsHub {
    function datasOf(
        uint _launchpadID,
        uint _cvID
    ) external view returns (DataTypes.InvestorData memory);

    /**
     * @param _tierID is ID of current tier ID
     * @param _cvID is sender of value
     * @param _value is msg.value of sender
     */
    function _investOnLaunchpad(
        uint _tierID,
        uint _cvID,
        uint _value
    ) external payable returns (bool);


    function withdrawTokens(
        uint _cvID,
        uint _launchpadID
    ) external;
}
