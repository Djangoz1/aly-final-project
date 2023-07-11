// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import {DataTypes} from "./libraries/DataTypes.sol";
import {IAccessControl} from "./interfaces/IAccessControl.sol";

contract WorkerProposal {
    uint id;

    DataTypes.WorkerProposalType workflow;
    DataTypes.WorkerProposalData datas;

    constructor(DataTypes.WorkerProposalData memory _data, uint _id) {
        id = _id;
        datas = _data;
        datas.createdAt = block.timestamp;
    }

    function getDatas()
        external
        view
        returns (DataTypes.WorkerProposalData memory)
    {
        return datas;
    }
}
