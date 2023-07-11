// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import {DataTypes} from "../libraries/DataTypes.sol";

interface IWorkerProposalHub {
    function postWorkerProposal(
        DataTypes.WorkerProposalData memory _data,
        address _forCV
    ) external;

    function getIndexer(address _forCV) external view returns (uint[] memory);

    function getProposal(uint _id) external view returns (address);
}
