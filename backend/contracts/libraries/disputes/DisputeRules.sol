// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

library DisputeRules {
    // Ajoutez votre code ici
    struct Data {
        Status status;
        Vote decision;
        bool appeal;
    }

    enum Status {
        Initial,
        Reclaimed,
        Disputed,
        Tally,
        Resolved
    }

    enum Vote {
        Waiting,
        RefusedToArbitrate,
        PayerWins,
        PayeeWins
    }
}
