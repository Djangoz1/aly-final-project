// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import {DisputeArbitrators} from "../../libraries/disputes/DisputeArbitrators.sol";
import {DisputeTimes} from "../../libraries/disputes/DisputeTimes.sol";
import {DisputeTools} from "../../libraries/disputes/DisputeTools.sol";
import {DisputeDatas} from "../../libraries/disputes/DisputeDatas.sol";
import {DisputeCounters} from "../../libraries/disputes/DisputeCounters.sol";
import {DisputeRules} from "../../libraries/disputes/DisputeRules.sol";
import {IAddressHub} from "../../interfaces/IAddressHub.sol";
import {IDisputesHub} from "../../interfaces/IDisputesHub.sol";

import {IDispute} from "../../interfaces/IDispute.sol";
import "../../libraries/BindingsMint.sol";

contract EscrowDatasHub is Ownable {
    // Ajoutez votre code ici

    // using BindingsMint for DisputeDatas.Data;
    // using DisputeTimes for DisputeTimes.Data;

    IAddressHub private _iAH;

    mapping(uint => DisputeDatas.Data) private _datas;
    mapping(uint => DisputeTimes.Data) private _timers;
    mapping(uint => DisputeRules.Data) private _rules;
    mapping(uint => DisputeCounters.Data) private _counters;
    mapping(uint => mapping(uint => DisputeArbitrators.Status))
        private _allowances;
    mapping(uint => mapping(uint => DisputeRules.Vote)) private _votes;
    mapping(uint => uint[]) private _arbitrators;

    modifier onlyStatusOf(uint _disputeID, DisputeRules.Status _status) {
        require(_rules[_disputeID].status == _status, "Invalid dispute status");
        _;
    }
    modifier onlyArbitratorStatusOf(
        uint _disputeID,
        uint _arbitratorID,
        DisputeArbitrators.Status _status
    ) {
        require(
            _allowances[_disputeID][_arbitratorID] == _status,
            "Not allowed"
        );
        _;
    }

    modifier onlyDispute() {
        uint id = IDispute(msg.sender).data().id;
        require(
            msg.sender == IDisputesHub(_iAH.disputesHub()).addressOf(id),
            "Must call by dispute contract"
        );
        _;
    }

    constructor(address _addressHub) {
        _iAH = IAddressHub(_addressHub);
        _iAH.setEscrowDatasHub();
    }

    function setArbitratorsOf(
        uint _disputeID,
        uint[] memory _indexer
    ) external {
        _arbitrators[_disputeID] = _indexer;
    }

    function addArbitratorOn(
        uint _disputeID,
        uint _arbitratorID
    )
        external
        onlyDispute
        onlyArbitratorStatusOf(
            _disputeID,
            _arbitratorID,
            DisputeArbitrators.Status.Invited
        )
        returns (uint)
    {
        _allowances[_disputeID][_arbitratorID] = DisputeArbitrators
            .Status
            .Accepted;
        _arbitrators[_disputeID].push(_arbitratorID);
        return _arbitrators[_disputeID].length;
    }

    function startVotesOf(uint _disputeID) external onlyDispute {
        require(
            _arbitrators[_disputeID].length >= 3,
            "Insuficient arbitrators"
        );

        _rules[_disputeID].status = DisputeRules.Status.Disputed;
        _timers[_disputeID].startedAt = block.timestamp;
    }

    function voteFor(
        uint _disputeID,
        uint _arbitratorID,
        DisputeRules.Vote _vote
    )
        external
        onlyDispute
        onlyArbitratorStatusOf(
            _disputeID,
            _arbitratorID,
            DisputeArbitrators.Status.Accepted
        )
        returns (uint)
    {
        require(_vote != DisputeRules.Vote.Waiting, "Invalid vote");

        require(
            _votes[_disputeID][_arbitratorID] == DisputeRules.Vote.Waiting,
            "Already voted"
        );

        if (_vote == DisputeRules.Vote.PayerWins) {
            _counters[_disputeID]._payerVote++;
        } else if (_vote == DisputeRules.Vote.PayeeWins) {
            _counters[_disputeID]._payeeVote++;
        }
        _counters[_disputeID]._voteIDs++;
        _votes[_disputeID][_arbitratorID] = _vote;
        return _counters[_disputeID]._voteIDs;
    }

    function tallyFor(uint _disputeID) external onlyDispute returns (uint) {
        uint winnerID = DisputeTools.winner(
            _datas[_disputeID],
            _counters[_disputeID]
        );

        if (winnerID == _datas[_disputeID].payerID) {
            _rules[_disputeID].decision = DisputeRules.Vote.PayerWins;
        } else if (winnerID == _datas[_disputeID].payeeID) {
            _rules[_disputeID].decision = DisputeRules.Vote.PayeeWins;
        } else {
            _rules[_disputeID].decision = DisputeRules.Vote.RefusedToArbitrate;
        }
        _timers[_disputeID].talliedAt = block.timestamp;
        _rules[_disputeID].status = DisputeRules.Status.Tally;
        return winnerID;
    }

    function resolveDisputeOf(uint _disputeID) external onlyDispute {
        _rules[_disputeID].status = DisputeRules.Status.Resolved;
        _timers[_disputeID].resolvedAt = block.timestamp;
    }

    function reclaimedFor(uint _disputeID) external onlyDispute returns (bool) {
        require(
            _rules[_disputeID].decision != DisputeRules.Vote.Waiting ||
                _rules[_disputeID].decision !=
                DisputeRules.Vote.RefusedToArbitrate,
            "Wrong decision"
        );
        _datas[_disputeID].value = 0;
        _rules[_disputeID].status = DisputeRules.Status.Reclaimed;
        _timers[_disputeID].reclaimedAt = block.timestamp;
        return true;
    }

    function refuseArbitration(
        uint _disputeID,
        uint _arbitratorID
    )
        external
        onlyDispute
        onlyArbitratorStatusOf(
            _disputeID,
            _arbitratorID,
            DisputeArbitrators.Status.Invited
        )
        returns (uint)
    {
        _counters[_disputeID]._arbitratorIDs--;
        _allowances[_disputeID][_arbitratorID] = DisputeArbitrators
            .Status
            .Refused;
        return _counters[_disputeID]._arbitratorIDs;
    }

    function appealOf(uint _disputeID) external onlyDispute returns (bool) {
        require(!_rules[_disputeID].appeal, "Appeal already done");
        require(
            _timers[_disputeID].reclaimedAt == 0,
            "Dispute already claimed"
        );
        DisputeCounters.Data memory _newCounters;
        for (
            uint256 index = 0;
            index < _arbitrators[_disputeID].length;
            index++
        ) {
            uint256 arbitratorID = _arbitrators[_disputeID][index];
            _allowances[_disputeID][arbitratorID] = DisputeArbitrators
                .Status
                .None;
            _votes[_disputeID][arbitratorID] = DisputeRules.Vote.Waiting;
        }
        uint[] memory _newArbitrators;
        _rules[_disputeID].appeal = true;
        _rules[_disputeID].status = DisputeRules.Status.Initial;
        _timers[_disputeID].startedAt = 0;
        _timers[_disputeID].resolvedAt = 0;
        _counters[_disputeID] = _newCounters;
        _arbitrators[_disputeID] = _newArbitrators;
        return true;
    }

    function setDatasOf(
        uint _disputeID,
        DisputeDatas.Data memory _data
    ) external {
        _datas[_disputeID] = _data;
    }

    function setTimersOf(
        uint _disputeID,
        DisputeTimes.Data memory timers
    ) external {
        _timers[_disputeID] = timers;
    }

    function setRulesOf(
        uint _disputeID,
        DisputeRules.Data memory _data
    ) external {
        _rules[_disputeID] = _data;
    }

    function setVoteOf(
        uint _disputeID,
        uint _arbitratorID,
        DisputeRules.Vote _vote
    ) external {
        _votes[_disputeID][_arbitratorID] = _vote;
    }

    function setCountersOf(
        uint _disputeID,
        DisputeCounters.Data memory _data
    ) external {
        _counters[_disputeID] = _data;
    }

    function setAllowanceOf(
        uint _disputeID,
        uint _arbitratorID,
        DisputeArbitrators.Status _status
    ) external {
        _allowances[_disputeID][_arbitratorID] = _status;
    }

    function datasOf(
        uint _disputeID
    ) external view returns (DisputeDatas.Data memory _data) {
        return _datas[_disputeID];
    }

    function arbitratorsOf(
        uint _disputeID
    ) external view returns (uint[] memory) {
        return _arbitrators[_disputeID];
    }

    function timersOf(
        uint _disputeID
    ) external view returns (DisputeTimes.Data memory _data) {
        return _timers[_disputeID];
    }

    function rulesOf(
        uint _disputeID
    ) external view returns (DisputeRules.Data memory _data) {
        return _rules[_disputeID];
    }

    function voteOf(
        uint _disputeID,
        uint _arbitratorID
    ) external view returns (DisputeRules.Vote) {
        return _votes[_disputeID][_arbitratorID];
    }

    function countersOf(
        uint _disputeID
    ) external view returns (DisputeCounters.Data memory _data) {
        return _counters[_disputeID];
    }

    function allowanceOf(
        uint _disputeID,
        uint _arbitratorID
    ) external view returns (DisputeArbitrators.Status) {
        return _allowances[_disputeID][_arbitratorID];
    }

    function getDisputeTimeData(
        uint _disputeID
    ) external view returns (DisputeTimes.Data memory _timeData) {
        return _timers[_disputeID];
    }
}
