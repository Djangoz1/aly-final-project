// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import {DataTypes} from "../libraries/DataTypes.sol";
import {IAccessControl} from "../interfaces/IAccessControl.sol";
import {IAddressHub} from "../interfaces/IAddressHub.sol";
import {ICVHub} from "../interfaces/ICVHub.sol";
import {IDisputesHub} from "../interfaces/IDisputesHub.sol";
import {IArbitratorsHub} from "../interfaces/IArbitratorsHub.sol";

contract Dispute is Ownable {
    // Ajoutez votre code ici

    using Counters for Counters.Counter;
    Counters.Counter private _arbitratorIDs;
    Counters.Counter private _voteIDs;

    DataTypes.DisputeData public data;
    DataTypes.EscrowStatus status;
    address disputesHub;
    address addressHub;

    mapping(uint => DataTypes.ArbitratorStatus) public arbitratorsAllowed;

    mapping(uint => DataTypes.ArbitrationVote) public votes;

    constructor(address _owner, DataTypes.DisputeData memory _data) {
        IAddressHub _addressHub = IAddressHub(msg.sender);
        require(
            msg.sender == _addressHub.disputesHub(),
            "Dispute: Invalid sender"
        );
        addressHub = msg.sender;
        transferOwnership(_owner);
        data = _data;
        if (data.nbArbitrators > 3) {
            IArbitratorsHub arbitratorsHub = IArbitratorsHub(
                _addressHub.arbitratorsHub()
            );
            uint arbitratorsSlot = data.nbArbitrators;
            while (arbitratorsSlot > 0) {
                uint arbitratorID = arbitratorsHub.selectArbitrator(
                    data.courtID
                );
                if (
                    arbitratorsAllowed[arbitratorID] ==
                    DataTypes.ArbitratorStatus.None
                ) {
                    arbitratorsAllowed[arbitratorID] = DataTypes
                        .ArbitratorStatus
                        .Invited;
                    arbitratorsSlot--;
                }
            }
        }
    }

    function acceptArbitration() external {
        IArbitratorsHub _ArbitratorsHub = IArbitratorsHub(
            IAddressHub(addressHub).arbitratorsHub()
        );
        require(
            status == DataTypes.EscrowStatus.Initial,
            "Dispute: Invalid status"
        );
        require(
            _arbitratorIDs.current() < data.nbArbitrators,
            "Dispute: Invalid arbitrators number"
        );

        ICVHub _CVHub = ICVHub(IAddressHub(addressHub).cvHub());
        uint cvID = _CVHub.getCV(msg.sender);
        uint arbitratorID = _ArbitratorsHub.getArbitrationOfCV(
            cvID,
            data.courtID
        );

        require(
            arbitratorsAllowed[arbitratorID] ==
                DataTypes.ArbitratorStatus.Invited,
            "Dispute: Wrong allowance arbitrator"
        );
        _arbitratorIDs.increment();
        arbitratorsAllowed[cvID] = DataTypes.ArbitratorStatus.Accepted;
        if (_arbitratorIDs.current() == data.nbArbitrators) {
            _startedVotePeriod();
        }
    }

    function _startedVotePeriod() internal {
        status = DataTypes.EscrowStatus.Disputed;
        data.createdAt = block.timestamp;
    }

    function startedVotePeriod() external onlyOwner {
        require(
            status == DataTypes.EscrowStatus.Initial,
            "Dispute: Invalid status"
        );
        require(_arbitratorIDs.current() >= 3, "Invalid arbitrators number");
        _startedVotePeriod();
    }

    function vote(DataTypes.ArbitrationVote _vote) external {
        IArbitratorsHub _ArbitratorsHub = IArbitratorsHub(
            IAddressHub(addressHub).arbitratorsHub()
        );
        ICVHub _CVHub = ICVHub(IAddressHub(addressHub).cvHub());
        uint cvID = _CVHub.getCV(msg.sender);
        uint arbitratorID = _ArbitratorsHub.getArbitrationOfCV(
            cvID,
            data.courtID
        );
        require(
            status == DataTypes.EscrowStatus.Disputed,
            "Dispute: Invalid status"
        );
        require(
            arbitratorsAllowed[arbitratorID] ==
                DataTypes.ArbitratorStatus.Accepted,
            "Dispute: Invalid arbitrator"
        );
        require(
            votes[arbitratorID] == DataTypes.ArbitrationVote.Waiting,
            "Dispute: Already voted"
        );
        require(
            _vote != DataTypes.ArbitrationVote.Waiting,
            "Dispute: Invalid ruling"
        );
        _voteIDs.increment();
        votes[arbitratorID] = DataTypes.ArbitrationVote(_vote);
        arbitratorsAllowed[arbitratorID] == DataTypes.ArbitratorStatus.None;
        _ArbitratorsHub.incrementVote(cvID, data.courtID);
        if (_voteIDs.current() == _arbitratorIDs.current()) {
            _resolvedDispute();
        } else if (data.createdAt + data.reclamationPeriod < block.timestamp) {
            _resolvedDispute();
        }
    }

    function _resolvedDispute() internal {
        data.resolvedAt = block.timestamp;
        status = DataTypes.EscrowStatus.Resolved;
    }

    function resolvedDispute() external onlyOwner {
        require(
            status == DataTypes.EscrowStatus.Disputed,
            "Dispute: Invalid status"
        );
        require(_voteIDs.current() > 3, "Dispute: Must at least 3 votes");
        require(
            data.createdAt + data.reclamationPeriod < block.timestamp,
            "Dispute: Vote period not finished"
        );
        _resolvedDispute();
    }
}
