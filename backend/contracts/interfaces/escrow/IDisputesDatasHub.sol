// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {DisputeRules} from "../../libraries/disputes/DisputeRules.sol";
import {DisputeTimes} from "../../libraries/disputes/DisputeTimes.sol";
import {DisputeCounters} from "../../libraries/disputes/DisputeCounters.sol";
import {DisputeDatas} from "../../libraries/disputes/DisputeDatas.sol";
import {DisputeArbitrators} from "../../libraries/disputes/DisputeArbitrators.sol";

interface IDisputesDatasHub {
    function setDatasOf(
        uint _disputeID,
        DisputeDatas.Data memory _data
    ) external;

    function setArbitratorsOf(uint _disputeID, uint[] memory _indexer) external;

    function setTimersOf(
        uint _disputeID,
        DisputeTimes.Data memory _data
    ) external;

    function reclaimedFor(uint _disputeID) external returns (bool);

    function voteFor(
        uint _disputeID,
        uint _arbitratorID,
        DisputeRules.Vote _vote
    ) external returns (uint);

    function tallyFor(uint _disputeID) external returns (uint);

    function appealOf(uint _disputeID) external returns (bool);

    function refuseArbitration(
        uint _disputeID,
        uint _arbitratorID
    ) external returns (uint);

    function resolveDisputeOf(uint _disputeID) external;

    function startVotesOf(uint _disputeID) external;

    function addArbitratorOn(
        uint _disputeID,
        uint _arbitratorID
    ) external returns (uint);

    function setVoteOf(
        uint _disputeID,
        uint _arbitratorID,
        DisputeRules.Vote _vote
    ) external;

    function setRulesOf(
        uint _disputeID,
        DisputeRules.Data memory _data
    ) external;

    function setCountersOf(
        uint _disputeID,
        DisputeCounters.Data memory _data
    ) external;

    function setAllowanceOf(
        uint _disputeID,
        uint _arbitratorID,
        DisputeArbitrators.Status _status
    ) external;

    function datasOf(
        uint _disputeID
    ) external view returns (DisputeDatas.Data memory _data);

    function arbitratorsOf(
        uint _disputeID
    ) external view returns (uint[] memory);

    function timersOf(
        uint _disputeID
    ) external view returns (DisputeTimes.Data memory _data);

    function rulesOf(
        uint _disputeID
    ) external view returns (DisputeRules.Data memory _data);

    function voteOf(
        uint _disputeID,
        uint _arbitratorID
    ) external view returns (DisputeRules.Vote);

    function countersOf(
        uint _disputeID
    ) external view returns (DisputeCounters.Data memory _data);

    function allowanceOf(
        uint _disputeID,
        uint _arbitratorID
    ) external view returns (DisputeArbitrators.Status);
}
