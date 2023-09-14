// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {DataTypes} from "../DataTypes.sol";

library DisputeDatas {
    // Ajoutez votre code ici

    struct Data {
        uint256 id;
        uint8 nbArbitrators;
        uint32 reclamationPeriod;
        DataTypes.CourtIDs courtID;
        uint256 featureID;
        uint256 value;
        uint256 payerID; // cvID
        uint256 payeeID; // cvID
        string tokenURI;
    }
}
