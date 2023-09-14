// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import {DataTypes} from "../libraries/DataTypes.sol";
import {IAccessControl} from "../interfaces/IAccessControl.sol";

interface ILaunchpadHub {
    function mint(
        uint _cvID,
        DataTypes.LaunchpadData calldata _datas,
        DataTypes.TierData[] calldata _tierDatas,
        uint _pubID
    ) external returns (uint);

    function getTokensLength() external view returns (uint);

    function getLaunchpad(uint _id) external view returns (address);

    function setLaunchpadInvestor(address _launchpadInvestor) external;
}
