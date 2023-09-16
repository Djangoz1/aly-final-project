// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {DisputeRules} from "./DisputeRules.sol";

library DisputeCounters {
    // Ajoutez votre code ici
    struct Data {
        uint _arbitratorIDs;
        uint _voteIDs;
        uint _payerVote;
        uint _payeeVote;
    }

    /**
     * @notice this function will not update storage but return an updated _counter
     */
    function vote(
        DisputeRules.Vote _vote,
        Data memory _counter
    ) internal pure returns (Data memory) {
        require(_vote != DisputeRules.Vote.Waiting, "Invalid ruling vote");

        if (_vote == DisputeRules.Vote.PayerWins) {
            _counter._payerVote++;
        } else if (_vote == DisputeRules.Vote.PayeeWins) {
            _counter._payeeVote++;
        }
        _counter._voteIDs++;
        return _counter;
    }
}
