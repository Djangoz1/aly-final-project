// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import {DataTypes} from "../libraries/DataTypes.sol";

interface IWorkerProposal {
    // Ajoutez votre code ici
    function getDatas()
        external
        view
        returns (DataTypes.WorkerProposalData memory);
}
