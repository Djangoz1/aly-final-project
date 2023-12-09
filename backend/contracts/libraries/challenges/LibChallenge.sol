// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;
import "../DataTypes.sol";

library LibChallenge {
    // Ajoutez votre code ici
    struct ChallengeDatas {
        string tokenURI;
        uint reward;
        uint[] winnerIDs;
        uint timelapse;
        uint createdAt;
        uint resolvedAt;
        uint votes;
        uint claimAt;
        uint8 participants;
        bool onETH;
        DataTypes.CourtIDs courtID;
    }

    struct ChallengerDatas {
        uint challengeID;
        uint votes;
        string tokenURI;
    }
}
