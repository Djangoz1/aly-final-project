// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import {DataTypes} from "../libraries/DataTypes.sol";
import {Bindings} from "../libraries/Bindings.sol";
import {IAccessControl} from "../interfaces/IAccessControl.sol";

contract WorkProposalHub {
    using Counters for Counters.Counter;
    Counters.Counter private _workerProposalIds;

    mapping(address => uint[]) indexerProposal;

    mapping(uint => address) proposals;

    IAccessControl accessControl;

    modifier onlyProxy() {
        require(
            msg.sender == address(accessControl),
            "Must call function with proxy bindings"
        );
        _;
    }

    // *::::::::: ----------- :::::::::* //
    // *::::::::: CONSTRUCTOR :::::::::* //
    // *::::::::: ----------- :::::::::* //
    constructor(address _accessControl) {
        accessControl = IAccessControl(_accessControl);
        accessControl.setWorkerProposalHub(address(this));
    }

    function postWorkerProposal(
        DataTypes.WorkerProposalData memory _data,
        address _forCV
    ) external onlyProxy {
        address newProposal = Bindings.deployWorkerProposal(
            _data,
            _workerProposalIds.current()
        );
        indexerProposal[_forCV].push(_workerProposalIds.current());
        proposals[_workerProposalIds.current()] = newProposal;
        _workerProposalIds.increment();
    }

    function getIndexer(
        address _forCV
    ) external view onlyProxy returns (uint[] memory) {
        return indexerProposal[_forCV];
    }

    function getProposal(uint _id) external view onlyProxy returns (address) {
        require(_id < _workerProposalIds.current(), "Id out of range");
        return proposals[_id];
    }
}
