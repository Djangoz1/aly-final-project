// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";

import {DataTypes} from "../libraries/DataTypes.sol";
import {IAccessControl} from "../interfaces/IAccessControl.sol";
import {IAddressHub} from "../interfaces/IAddressHub.sol";
import {ICVHub} from "../interfaces/ICVHub.sol";
import {IFeaturesHub} from "../interfaces/IFeaturesHub.sol";
import {IMissionsHub} from "../interfaces/IMissionsHub.sol";
import {IDisputesHub} from "../interfaces/IDisputesHub.sol";
import {IArbitratorsHub} from "../interfaces/IArbitratorsHub.sol";
import {Bindings} from "../libraries/Bindings.sol";

contract Dispute is Ownable {
    // Ajoutez votre code ici
    // Bindings bindings = Bindings(address(this));

    using Counters for Counters.Counter;
    Counters.Counter private _arbitratorIDs;
    Counters.Counter private _voteIDs;
    Counters.Counter private _payerVote;
    Counters.Counter private _payeeVote;

    DataTypes.DisputeData public data;
    DataTypes.EscrowStatus public status;
    DataTypes.ArbitrationVote public decision;
    address disputesHub;
    address addressHub;
    address cvHub;
    uint featureID;

    mapping(uint => DataTypes.ArbitratorStatus) arbitratorsAllowed;

    uint[] arbitrators;

    mapping(uint => DataTypes.ArbitrationVote) votes;

    constructor(
        address _addrHub,
        address _owner,
        DataTypes.DisputeData memory _data,
        uint _featureID
    ) {
        IAddressHub _AddressHub = IAddressHub(_addrHub);
        require(
            msg.sender == _AddressHub.disputesHub(),
            "Dispute: Invalid sender"
        );
        addressHub = _addrHub;
        cvHub = _AddressHub.cvHub();
        transferOwnership(_owner);
        data = _data;
        _selectRandomlyArbitrator();
        featureID = _featureID;
    }

    function acceptArbitration() external {
        IArbitratorsHub _ArbitratorsHub = IArbitratorsHub(
            IAddressHub(addressHub).arbitratorsHub()
        );
        require(status == DataTypes.EscrowStatus.Initial, "Invalid status");

        ICVHub _CVHub = ICVHub(IAddressHub(addressHub).cvHub());
        uint cvID = _CVHub.getCV(msg.sender);
        uint arbitratorID = _ArbitratorsHub.getArbitrationOfCV(
            cvID,
            data.courtID
        );

        require(
            arbitratorsAllowed[arbitratorID] ==
                DataTypes.ArbitratorStatus.Invited,
            "Wrong allowance arbitrator"
        );

        arbitratorsAllowed[arbitratorID] = DataTypes.ArbitratorStatus.Accepted;
        arbitrators.push(arbitratorID);

        if (arbitrators.length == data.nbArbitrators) {
            _startedVotePeriod();
        }
    }

    function refuseArbitration() external {
        IArbitratorsHub _ArbitratorsHub = IArbitratorsHub(
            IAddressHub(addressHub).arbitratorsHub()
        );
        require(status == DataTypes.EscrowStatus.Initial, "Invalid status");

        ICVHub _CVHub = ICVHub(IAddressHub(addressHub).cvHub());
        uint cvID = _CVHub.getCV(msg.sender);
        uint arbitratorID = _ArbitratorsHub.getArbitrationOfCV(
            cvID,
            data.courtID
        );

        require(
            arbitratorsAllowed[arbitratorID] ==
                DataTypes.ArbitratorStatus.Invited,
            "Wrong allowance arbitrator"
        );
        arbitratorsAllowed[arbitratorID] = DataTypes.ArbitratorStatus.Refused;
        _arbitratorIDs.decrement();
        if (_arbitratorIDs.current() < 3) {
            _selectRandomlyArbitrator();
        }
    }

    function _selectRandomlyArbitrator() internal {
        IAddressHub _AddressHub = IAddressHub(addressHub);

        IArbitratorsHub _ArbitratorsHub = IArbitratorsHub(
            _AddressHub.arbitratorsHub()
        );
        ICVHub _CVHub = ICVHub(_AddressHub.cvHub());
        uint arbitratorsSlot = data.nbArbitrators * 2;
        uint randomID;

        for (
            uint256 index = 0;
            index < _ArbitratorsHub.getCourtLength(data.courtID) * 2;
            index++
        ) {
            if (arbitratorsSlot == 0) {
                break;
            }

            if (_ArbitratorsHub.balanceOfCourt(data.courtID) > 0) {
                randomID = _ArbitratorsHub.boostRandomlyArbitrator(
                    data.courtID,
                    randomID * arbitratorsSlot * index
                );
            } else {
                randomID = _ArbitratorsHub.randomlyArbitrator(
                    data.courtID,
                    arbitratorsSlot * randomID + index
                );
            }
            if (data.nbArbitrators >= 3 && arbitratorsSlot != 0) {
                if (
                    arbitratorsAllowed[randomID] ==
                    DataTypes.ArbitratorStatus.None &&
                    _CVHub.getCV(_ArbitratorsHub.ownerOf(randomID)) !=
                    data.payerID &&
                    _CVHub.getCV(_ArbitratorsHub.ownerOf(randomID)) !=
                    data.payeeID
                ) {
                    arbitratorsAllowed[randomID] = DataTypes
                        .ArbitratorStatus
                        .Invited;
                    arbitratorsSlot--;
                    _arbitratorIDs.increment();
                }
            }
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
        require(status == DataTypes.EscrowStatus.Disputed, "Invalid status");
        require(
            arbitratorsAllowed[arbitratorID] ==
                DataTypes.ArbitratorStatus.Accepted,
            "Invalid arbitrator status"
        );
        require(
            votes[arbitratorID] == DataTypes.ArbitrationVote.Waiting,
            "Already voted"
        );
        require(
            _vote != DataTypes.ArbitrationVote.Waiting,
            "Invalid ruling vote"
        );
        _voteIDs.increment();
        votes[arbitratorID] = _vote;

        if (_vote == DataTypes.ArbitrationVote.PayerWins) {
            _payerVote.increment();
        }
        if (_vote == DataTypes.ArbitrationVote.PayeeWins) {
            _payeeVote.increment();
        }
        _ArbitratorsHub.incrementVote(cvID, data.courtID);
        if (_voteIDs.current() == data.nbArbitrators) {
            _resolvedDispute();
        } else if (data.createdAt + data.reclamationPeriod < block.timestamp) {
            _resolvedDispute();
        }
    }

    function _resolvedDispute() internal {
        data.resolvedAt = block.timestamp;
        status = DataTypes.EscrowStatus.Resolved;
        IAddressHub iAH = IAddressHub(addressHub);
        IFeaturesHub iFH = IFeaturesHub(iAH.featuresHub());
        if (_payerVote.current() > _payeeVote.current()) {
            decision = DataTypes.ArbitrationVote.PayerWins;
            iFH.resolvedDispute(data.payerID, featureID);
        } else if (_payerVote.current() < _payeeVote.current()) {
            decision = DataTypes.ArbitrationVote.PayeeWins;
            iFH.resolvedDispute(data.payeeID, featureID);
        } else {
            decision = DataTypes.ArbitrationVote.RefusedToArbitrate;
        }
    }

    function appeal() external {
        IAddressHub iAH = IAddressHub(addressHub);
        require(!data.appeal, "Appeal already done");
        require(
            status == DataTypes.EscrowStatus.Resolved,
            "Wrong dispute status"
        );

        require(
            data.payerID == Bindings.getCV(msg.sender, iAH.cvHub()) ||
                data.payeeID == Bindings.getCV(msg.sender, iAH.cvHub()),
            "Not part of dispute"
        );
        for (uint256 index = 0; index < arbitrators.length; index++) {
            uint arbitratorID = arbitrators[index];
            arbitratorsAllowed[arbitratorID] = DataTypes.ArbitratorStatus.None;
        }
        _arbitratorIDs.reset();
        _voteIDs.reset();
        _payerVote.reset();
        _payeeVote.reset();
        arbitrators = new uint[](data.nbArbitrators * 2);
        _selectRandomlyArbitrator();
    }

    function hisAllowance(
        uint _arbitratorID
    ) external view returns (DataTypes.ArbitratorStatus) {
        return arbitratorsAllowed[_arbitratorID];
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

    function getArbitrators() external view returns (uint[] memory) {
        return arbitrators;
    }

    function getArbitratorsLength() external view returns (uint) {
        return _arbitratorIDs.current();
    }

    function getVotesLength() external view returns (uint) {
        return _voteIDs.current();
    }
}
