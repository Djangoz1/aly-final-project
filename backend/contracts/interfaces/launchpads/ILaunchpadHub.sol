// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {DataTypes} from "../../libraries/DataTypes.sol";

interface ILaunchpadHub {
    function maxTiers() external view returns (uint);

    function mint(
        uint _cvID,
        DataTypes.LaunchpadData calldata _datas,
        DataTypes.TierData[] calldata _tierDatas,
        uint _pubID
    ) external returns (uint);

    function owner() external view returns (address);

    function tokensLength() external view returns (uint);

    function launchpadsOfCV(uint _cvID) external view returns (uint[] memory);

    function addressOf(uint _id) external view returns (address);

    function setLaunchpadInvestor(address _launchpadInvestor) external;
}
