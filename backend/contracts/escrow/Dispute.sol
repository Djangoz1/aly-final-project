// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

// import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
// import "@openzeppelin/contracts/utils/Counters.sol";
// import "@openzeppelin/contracts/utils/math/SafeMath.sol";

import {Bindings} from "../libraries/Bindings.sol";
import {DataTypes} from "../libraries/DataTypes.sol";
import {BindingsMint} from "../libraries/BindingsMint.sol";

import {DisputeTimes} from "../libraries/disputes/DisputeTimes.sol";
import {DisputeDatas} from "../libraries/disputes/DisputeDatas.sol";
import {DisputeArbitrators} from "../libraries/disputes/DisputeArbitrators.sol";
import {DisputeTools} from "../libraries/disputes/DisputeTools.sol";
import {DisputeRules} from "../libraries/disputes/DisputeRules.sol";
import {DisputeCounters} from "../libraries/disputes/DisputeCounters.sol";

import {IToken} from "../interfaces/erc/IToken.sol";
import {IAddressSystem} from "../interfaces/system/IAddressSystem.sol";
import {IArbitratorsHub} from "../interfaces/escrow/IArbitratorsHub.sol";
import {IDisputesDatasHub} from "../interfaces/escrow/IDisputesDatasHub.sol";
import {IFeaturesHub} from "../interfaces/works/IFeaturesHub.sol";
import {IDisputesHub} from "../interfaces/escrow/IDisputesHub.sol";

contract Dispute is Ownable {
    // Ajoutez votre code ici
    using DisputeTools for DisputeTools.Tools;

    DisputeTools.Tools private _tools;

    uint32 public constant APPEAL_PERIOD = 2 seconds; // Change to days on production
    IAddressSystem private _iAS;

    modifier onlyProxy() {
        require(
            msg.sender == address(_iAS.apiPost()),
            "Must call function with proxy bindings"
        );
        _;
    }

    modifier onlyStatus(DisputeRules.Status _status, bool _bool) {
        require(_status == _rules().status == _bool, "Invalid status");
        _;
    }
    modifier onlyFromClient() {
        uint256 cvID = _cvOf(msg.sender);
        DisputeDatas.Data memory _data = _data();
        require(
            _data.payerID == cvID || _data.payeeID == cvID,
            "Not part of dispute"
        );
        _;
    }

    modifier checkLink(uint _cvID) {
        DisputeDatas.Data memory _data = _data();
        require(
            _data.payerID == _cvID || _data.payeeID == _cvID,
            "Not part of dispute"
        );
        _;
    }

    constructor(
        address _addressSystem,
        address _owner,
        DisputeDatas.Data memory _data
    ) {
        _iAS = IAddressSystem(_addressSystem);
        require(msg.sender == _iAS.factory(), "Dispute : failure constructor");

        _tools.addressSystem = _addressSystem;
        _tools.datasHub = _iAS.disputesDatasHub();
        _tools.id = _data.id;

        IDisputesDatasHub _iDDH = IDisputesDatasHub(_tools.datasHub);
        _iDDH.setDatasOf(_tools.id, _data);

        transferOwnership(_owner);
    }

    function id() external view returns (uint) {
        return _tools.id;
    }

    function init(
        uint _cvID
    )
        external
        checkLink(_cvID)
        onlyStatus(DisputeRules.Status.Initial, true)
        onlyProxy
    {
        require(_timers().createdAt == 0, "Dispute already init");

        _selectArbitrators();

        IDisputesDatasHub _iDDH = IDisputesDatasHub(_tools.datasHub);
        DisputeTimes.Data memory _timers;

        _timers.createdAt = block.timestamp;
        _iDDH.setTimersOf(_tools.id, _timers);
    }

    function acceptArbitration(
        uint _cvID
    )
        external
        onlyProxy
        onlyStatus(DisputeRules.Status.Initial, true)
        returns (bool)
    {
        IDisputesDatasHub _iDDH = IDisputesDatasHub(_tools.datasHub);
        DisputeDatas.Data memory data = _data();

        uint arbitratorID = _arbitratorOf(_cvID);
        uint _arbitratorsLength = _iDDH.addArbitratorOn(
            _tools.id,
            arbitratorID
        );
        if (_arbitratorsLength == data.nbArbitrators) {
            _startedVotePeriod();
        }
        return true;
    }

    function refuseArbitration(
        uint _cvID
    ) external onlyProxy onlyStatus(DisputeRules.Status.Initial, true) {
        IDisputesDatasHub _iDDH = IDisputesDatasHub(_tools.datasHub);

        uint arbitratorID = _arbitratorOf(_cvID);
        uint slot = _iDDH.refuseArbitration(_tools.id, arbitratorID);
        if (slot < 3) {
            _selectArbitrators();
        }
    }

    function _selectArbitrators() internal {
        IDisputesDatasHub _iDDH = IDisputesDatasHub(_tools.datasHub);
        address arbitratorsHub = _iAS.arbitratorsHub();
        IArbitratorsHub _ArbitratorsHub = IArbitratorsHub(arbitratorsHub);
        DisputeDatas.Data memory data = _data();
        DisputeCounters.Data memory counters = _counters();

        uint256 arbitratorsSlot = data.nbArbitrators * 2;
        /// @notice arbitratorID
        uint256 randomID;
        uint courtLength = _ArbitratorsHub.lengthOfCourt(data.courtID);

        for (uint256 index = 0; index < courtLength * 2; index++) {
            if (arbitratorsSlot == 0) {
                break;
            }

            if (IToken(_iAS.token()).totalStaked() > 0) {
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
                uint randomCV = _cvOf(
                    Bindings.ownerOf(randomID, arbitratorsHub)
                );
                if (
                    _iDDH.allowanceOf(_tools.id, randomID) ==
                    DisputeArbitrators.Status.None &&
                    !_checkCVLink(randomCV) &&
                    !_ArbitratorsHub.isBanned(randomCV)
                ) {
                    _iDDH.setAllowanceOf(
                        _tools.id,
                        randomID,
                        DisputeArbitrators.Status.Invited
                    );

                    arbitratorsSlot--;
                    counters._arbitratorIDs++;
                }
            }
        }
        _iDDH.setCountersOf(_tools.id, counters);
    }

    function _startedVotePeriod() internal {
        IDisputesDatasHub _iDDH = IDisputesDatasHub(_tools.datasHub);
        _iDDH.startVotesOf(_tools.id);
    }

    function startedVotePeriod(
        uint _cvID
    )
        external
        onlyProxy
        checkLink(_cvID)
        onlyStatus(DisputeRules.Status.Initial, true)
    {
        require(
            _timers().createdAt + _data().reclamationPeriod <= block.timestamp,
            "Must wait started period"
        );
        _startedVotePeriod();
    }

    function vote(
        uint _cvID,
        DisputeRules.Vote _vote
    ) external onlyProxy onlyStatus(DisputeRules.Status.Disputed, true) {
        IArbitratorsHub _iArbH = IArbitratorsHub(_iAS.arbitratorsHub());

        IDisputesDatasHub _iDDH = IDisputesDatasHub(_tools.datasHub);
        DisputeDatas.Data memory _data = _iDDH.datasOf(_tools.id);

        uint arbitratorID = _arbitratorOf(_cvID);

        uint votesLength = _iDDH.voteFor(_tools.id, arbitratorID, _vote);

        _iArbH.incrementVote(_cvID, _data.courtID);
        if (
            votesLength == _arbitrators().length ||
            _iDDH.timersOf(_tools.id).startedAt +
                _data.reclamationPeriod *
                1 days <
            block.timestamp
        ) {
            _tally();
        }
    }

    function _reclaimed(uint _winnerID) internal {
        require(_winnerID > 0, "Unclear decision");
        IDisputesDatasHub _iDDH = IDisputesDatasHub(_tools.datasHub);
        DisputeDatas.Data memory data = _data();
        IFeaturesHub _iFH = IFeaturesHub(_iAS.featuresHub());
        bool success = _iFH.resolvedDispute(_winnerID, data.featureID);
        _iDDH.reclaimedFor(_tools.id);
    }

    function _tally() internal returns (uint) {
        IDisputesDatasHub _iDDH = IDisputesDatasHub(_tools.datasHub);

        uint256 winnerID = _iDDH.tallyFor(_tools.id);

        if (_rules().appeal) {
            _resolvedDispute();
        }
        return winnerID;
    }

    function _checkCVLink(uint _cvID) internal view returns (bool) {
        DisputeDatas.Data memory data = _data();
        if (_cvID == data.payerID || _cvID == data.payeeID) {
            return true;
        } else {
            return false;
        }
    }

    function _resolvedDispute()
        internal
        onlyStatus(DisputeRules.Status.Tally, true)
    {
        uint winnerID = DisputeTools.winner(_data(), _counters());
        IDisputesDatasHub _iDDH = IDisputesDatasHub(_tools.datasHub);
        _iDDH.resolveDisputeOf(_tools.id);
        if (winnerID > 0) {
            _reclaimed(winnerID);
        }
    }

    function doAppeal(
        uint _cvID
    )
        external
        onlyProxy
        onlyStatus(DisputeRules.Status.Tally, true)
        checkLink(_cvID)
    {
        IDisputesDatasHub _iDDH = IDisputesDatasHub(_tools.datasHub);

        bool success = _iDDH.appealOf(_tools.id);
        require(success, "Error appeal");
        _selectArbitrators();
    }

    function resolvedDispute(
        uint _cvID
    )
        external
        onlyProxy
        onlyStatus(DisputeRules.Status.Reclaimed, false)
        checkLink(_cvID)
    {
        DisputeRules.Data memory rules = _rules();
        DisputeDatas.Data memory data = _data();
        DisputeTimes.Data memory timers = _timers();
        require(timers.startedAt > 0, "Not started");
        require(
            (rules.status == DisputeRules.Status.Tally &&
                timers.talliedAt + APPEAL_PERIOD <= block.timestamp) ||
                (rules.status == DisputeRules.Status.Disputed &&
                    timers.startedAt + data.reclamationPeriod + APPEAL_PERIOD <=
                    block.timestamp),
            "Must wait release period"
        );

        if (rules.status == DisputeRules.Status.Disputed) {
            _tally();
        }
        _resolvedDispute();
    }

    function _cvOf(address _for) internal view returns (uint256) {
        return Bindings.cvOf(_for, _iAS.cvsHub());
    }

    function _data() internal view returns (DisputeDatas.Data memory _data) {
        return IDisputesDatasHub(_tools.datasHub).datasOf(_tools.id);
    }

    function _counters()
        internal
        view
        returns (DisputeCounters.Data memory _data)
    {
        return IDisputesDatasHub(_tools.datasHub).countersOf(_tools.id);
    }

    function _rules() internal view returns (DisputeRules.Data memory) {
        return IDisputesDatasHub(_tools.datasHub).rulesOf(_tools.id);
    }

    function _timers() internal view returns (DisputeTimes.Data memory _data) {
        return IDisputesDatasHub(_tools.datasHub).timersOf(_tools.id);
    }

    function _arbitrators() internal view returns (uint[] memory) {
        return IDisputesDatasHub(_tools.datasHub).arbitratorsOf(_tools.id);
    }

    function _arbitratorOf(uint _cvID) internal returns (uint) {
        return
            Bindings.arbitratorOf(
                _cvID,
                IDisputesDatasHub(_tools.datasHub).datasOf(_tools.id).courtID,
                _iAS.arbitratorsHub()
            );
    }
}
