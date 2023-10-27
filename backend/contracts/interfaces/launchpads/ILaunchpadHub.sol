// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {DataTypes} from "../../libraries/DataTypes.sol";

interface ILaunchpadHub {
    function maxTiers() external view returns (uint);

    function mint(
        uint _cvID,
        DataTypes.LaunchpadData memory _datas,
        DataTypes.TierData[] memory _tierDatas
    ) external returns (uint);

    function idOf(address _launchpad) external view returns (uint);

    function owner() external view returns (address);

    function tokensLength() external view returns (uint);

    function launchpadsOfCV(uint _cvID) external view returns (uint[] memory);

    function addressOf(uint _id) external view returns (address);

    function setLaunchpadInvestor(address _launchpadInvestor) external;
}
