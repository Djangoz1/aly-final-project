// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";

import {DataTypes} from "../libraries/DataTypes.sol";
import {DisputeRules} from "../libraries/disputes/DisputeRules.sol";
import {DisputeDatas} from "../libraries/disputes/DisputeDatas.sol";

interface IDispute {
    // Ajoutez votre code ici
    function init(uint _cvID) external;

    function disputeData() external view returns (address);

    function disputeRules() external view returns (address);

    function APPEAL_PERIOD() external view returns (uint);

    function acceptArbitration(uint _cvID) external;

    function refuseArbitration(uint _cvID) external;

    function startedVotePeriod(uint _cvID) external;

    function vote(uint _cvID, DisputeRules.Vote _vote) external;

    function doAppeal(uint _cvID) external;

    // function hisAllowance(
    //     uint256 arbitratorID
    // ) external view returns;

    function resolvedDispute(uint _cvID) external;

    function getArbitrators() external view returns (uint256[] memory);

    function getArbitratorsLength() external view returns (uint256);

    function getVotesLength() external view returns (uint256);

    function data() external view returns (DisputeDatas.Data memory);
}
