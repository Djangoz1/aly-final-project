// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

import {DataTypes} from "../libraries/DataTypes.sol";
import {IAccessControl} from "../interfaces/IAccessControl.sol";
import {LaunchpadHub} from "../storage/LaunchpadHub.sol";

contract Launchpad is Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tierID;

    using SafeMath for uint256;

    uint256 public id;

    DataTypes.LaunchpadData datas;

    DataTypes.LaunchpadStatus status;

    mapping(uint256 => DataTypes.TierData) tierDetails;
    mapping(address => DataTypes.InvestorData) investorDetails;

    IAccessControl accessControl;
    LaunchpadHub launchpadHub;

    constructor(
        address _accessControl,
        uint256 _id,
        DataTypes.LaunchpadData memory _datas
    ) {
        accessControl = IAccessControl(_accessControl);
        require(
            accessControl.getLaunchpadHub() == msg.sender,
            "Must deploy with launchpad"
        );
        launchpadHub = LaunchpadHub(msg.sender);
        _id = id;
        datas = _datas;
        for (uint8 i = 0; i <= _datas.numberOfTier; i++) {
            DataTypes.TierData memory _tierData;
            _tierData.minTierCap = _datas.minCap.div(_datas.numberOfTier);
            if (i == _datas.numberOfTier) {
                uint256 modulus = _datas.minCap.sub(_datas.maxCap);
                _tierData.maxTierCap = _tierData.minTierCap.add(modulus);
            } else {
                _tierData.maxTierCap = _tierData.minTierCap;
            }
            tierDetails[i] = _tierData;
        }
    }

    // *::::::::: ---------------- :::::::::* //
    // *::::::::: STATE MANAGEMENT :::::::::* //
    // *::::::::: ---------------- :::::::::* //

    function updateStartTime(uint256 _saleStart) external onlyOwner {
        require(datas.saleStart > block.timestamp, "Sale already started");
        datas.saleStart = _saleStart;
    }

    function updateEndTime(uint256 _saleEnd) external onlyOwner {
        require(
            _saleEnd > block.timestamp && datas.saleStart < _saleEnd,
            "Sale end can't be less than start time"
        );
        datas.saleEnd = _saleEnd;
    }

    function updateTiers(
        uint8 _tierIDs,
        uint256[] memory _maxTierCaps,
        uint256[] memory _minTierCaps
    ) external onlyOwner {
        require(
            _tierIDs <= launchpadHub.maxTiers(),
            "Number of tiers out of range"
        );
        require(datas.saleStart > block.timestamp, "Sale already started");
        require(
            _tierIDs == _maxTierCaps.length && _tierIDs == _minTierCaps.length,
            "Mismatch datas tier"
        );
        uint256 totalMinCap;
        uint256 totalMaxCap;
        for (uint8 i = 0; i < _tierIDs; i++) {
            require(
                _maxTierCaps[i] >= _minTierCaps[i] &&
                    _maxTierCaps[i] > 0 &&
                    _minTierCaps[i] > 0,
                "Mismatch data capitalization"
            );
            totalMinCap.add(_minTierCaps[i]);
            totalMaxCap.add(_maxTierCaps[i]);
        }
        require(
            totalMinCap < totalMaxCap,
            "Mismatch min and max capitalization"
        );
        for (uint8 i = 0; i <= _tierIDs; i++) {
            DataTypes.TierData memory _tierData;
            _tierData.maxTierCap = _maxTierCaps[i];
            _tierData.minTierCap = _minTierCaps[i];
            tierDetails[i] = _tierData;
        }
        datas.numberOfTier = _tierIDs;
        datas.minCap = totalMinCap;
        datas.maxCap = totalMaxCap;
    }

    // *::::::::: ------------- :::::::::* //
    // *::::::::: USER BINDINGS :::::::::* //
    // *::::::::: ------------- :::::::::* //

    function buyTokens() external payable {
        require(datas.saleStart <= block.timestamp, "Sale not started yet");
        require(datas.saleEnd >= block.timestamp, "Sale ended");
        require(msg.value > 0, "Value must be more than 0");
        accessControl.hasRegistred(msg.sender);

        if (
            tierDetails[_tierID.current()].maxTierCap ==
            tierDetails[_tierID.current()].amountRaised
        ) {
            require(
                _tierID.current() <= datas.numberOfTier,
                "Fundrising has already obtained his objectif"
            );
            _tierID.increment();
        }
        require(
            investorDetails[msg.sender].tier.length ==
                investorDetails[msg.sender].investedAmount.length,
            "Mismatch investors details data"
        );
        require(
            tierDetails[_tierID.current()].maxTierCap <=
                tierDetails[_tierID.current()].amountRaised.add(msg.value),
            "Value out of range for this tier"
        );
        if (
            investorDetails[msg.sender].tier.length == 0 &&
            investorDetails[msg.sender].investedAmount.length == 0
        ) {
            investorDetails[msg.sender].tier.push(uint8(_tierID.current()));
            investorDetails[msg.sender].investedAmount.push(msg.value);
            tierDetails[_tierID.current()].users.add(1);
            datas.totalUser.add(1);
        } else {
            bool alreadyInvested = false;

            for (
                uint256 index = 0;
                index < investorDetails[msg.sender].tier.length;
                index++
            ) {
                if (
                    investorDetails[msg.sender].tier[index] == _tierID.current()
                ) {
                    investorDetails[msg.sender].investedAmount[index].add(
                        msg.value
                    );
                    alreadyInvested = true;
                }
            }
            if (!alreadyInvested) {
                investorDetails[msg.sender].investedAmount.push(msg.value);
                tierDetails[_tierID.current()].users.add(1);
            }
        }
        tierDetails[_tierID.current()].amountRaised.add(msg.value);
        if (
            tierDetails[_tierID.current()].maxTierCap ==
            tierDetails[_tierID.current()].amountRaised &&
            _tierID.current() < datas.numberOfTier
        ) {
            _tierID.increment();
        }
    }
}
