// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {Bindings} from "../Bindings.sol";

import {DisputeRules} from "./DisputeRules.sol";
import {DisputeDatas} from "./DisputeDatas.sol";
import {DisputeArbitrators} from "./DisputeArbitrators.sol";
import {DisputeCounters} from "./DisputeCounters.sol";
import {DisputeTimes} from "./DisputeTimes.sol";

import {IDisputesDatasHub} from "../../interfaces/escrow/IDisputesDatasHub.sol";

library DisputeTools {
    // Ajoutez votre code ici

    struct Tools {
        uint id;
        address addressSystem;
        address datasHub;
    }

    // function setData(
    //     address _datas,
    //     Tools storage _tools
    // ) internal view returns (address) {
    //     _tools.datasHub = _datas;
    // }

    function hub(Tools storage _tools) internal view returns (address) {
        return _tools.addressSystem;
    }

    function winner(
        DisputeDatas.Data memory _data,
        DisputeCounters.Data memory _counters
    ) internal pure returns (uint) {
        require(_counters._voteIDs >= 3, "Not enough vote");

        if (_counters._payerVote > _counters._payeeVote) {
            return _data.payerID;
        } else if (_counters._payerVote < _counters._payeeVote) {
            return _data.payeeID;
        }
        return 0;
    }

    function start(Tools storage _tools) internal {
        IDisputesDatasHub _iEDH = IDisputesDatasHub(_tools.datasHub);
        DisputeRules.Data memory _rules = _iEDH.rulesOf(_tools.id);
        DisputeTimes.Data memory _timers = _iEDH.timersOf(_tools.id);
        DisputeCounters.Data memory _counter = _iEDH.countersOf(_tools.id);
        _rules.status = DisputeRules.Status.Disputed;
        _timers.startedAt = block.timestamp;
        require(_counter._arbitratorIDs >= 3, "Insuficient arbitrators");
        _iEDH.setRulesOf(_tools.id, _rules);
        _iEDH.setTimersOf(_tools.id, _timers);
    }

    function allowanceOf(
        uint _arbitratorID,
        DisputeArbitrators.Status _status,
        IDisputesDatasHub _iEDH,
        Tools storage _tools
    ) internal view returns (bool) {
        if (_iEDH.allowanceOf(_tools.id, _arbitratorID) == _status) {
            return true;
        } else return false;
    }

    function vote(
        uint _arbitratorID,
        DisputeRules.Vote _vote,
        Tools memory _tools
    ) internal returns (uint) {
        IDisputesDatasHub _iEDH = IDisputesDatasHub(_tools.datasHub);

        require(
            _iEDH.voteOf(_tools.id, _arbitratorID) == DisputeRules.Vote.Waiting,
            "Already voted"
        );

        DisputeCounters.Data memory _newCounter = DisputeCounters.vote(
            _vote,
            _iEDH.countersOf(_tools.id)
        );
        _iEDH.setCountersOf(_tools.id, _newCounter);
        _iEDH.setVoteOf(_tools.id, _arbitratorID, _vote);

        return _newCounter._voteIDs;
    }

    function tally(Tools storage _tools) internal returns (uint) {
        IDisputesDatasHub _iEDH = IDisputesDatasHub(_tools.datasHub);
        DisputeCounters.Data memory _counter = _iEDH.countersOf(_tools.id);
        DisputeRules.Data memory _rules = _iEDH.rulesOf(_tools.id);
        DisputeDatas.Data memory _datas = _iEDH.datasOf(_tools.id);

        uint winnerID = winner(_datas, _counter);

        if (winnerID == _datas.payerID) {
            _rules.decision = DisputeRules.Vote.PayerWins;
        } else if (winnerID == _datas.payeeID) {
            _rules.decision = DisputeRules.Vote.PayeeWins;
        } else {
            _rules.decision = DisputeRules.Vote.RefusedToArbitrate;
        }

        _rules.status = DisputeRules.Status.Tally;
        _iEDH.setCountersOf(_tools.id, _counter);
        _iEDH.setRulesOf(_tools.id, _rules);

        return winnerID;
    }

    function appeal(Tools storage _tools) internal returns (bool) {
        IDisputesDatasHub _iEDH = IDisputesDatasHub(_tools.datasHub);
        DisputeRules.Data memory _rules = _iEDH.rulesOf(_tools.id);
        DisputeTimes.Data memory _timers = _iEDH.timersOf(_tools.id);
        uint[] memory _arbitrators = _iEDH.arbitratorsOf(_tools.id);

        require(!_rules.appeal, "Appeal already done");
        DisputeCounters.Data memory _counters;
        for (uint256 index = 0; index < _arbitrators.length; index++) {
            uint256 arbitratorID = _arbitrators[index];
            _iEDH.setAllowanceOf(
                _tools.id,
                arbitratorID,
                DisputeArbitrators.Status.None
            );
            _iEDH.setVoteOf(_tools.id, arbitratorID, DisputeRules.Vote.Waiting);
        }
        uint[] memory _newArbitrators;
        _rules.appeal = true;
        _rules.status = DisputeRules.Status.Initial;
        _timers.startedAt = 0;
        _timers.resolvedAt = 0;

        _iEDH.setCountersOf(_tools.id, _counters);
        _iEDH.setRulesOf(_tools.id, _rules);
        _iEDH.setTimersOf(_tools.id, _timers);
        _iEDH.setArbitratorsOf(_tools.id, _newArbitrators);
        return true;
    }
}
