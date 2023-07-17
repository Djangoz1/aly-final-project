// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "hardhat/console.sol";

import {DataTypes} from "../libraries/DataTypes.sol";
import {InteractionLogic} from "../libraries/InteractionLogic.sol";
import {IAccessControl} from "../interfaces/IAccessControl.sol";
import {LaunchpadCohort} from "../cohort/LaunchpadCohort.sol";
import {Launchpad} from "../launchpad/Launchpad.sol";
import {CollectLaunchpadInvestor} from "../collect/CollectLaunchpadInvestor.sol";
import {LaunchpadHub} from "../storage/LaunchpadHub.sol";

contract CollectLaunchpadDatas is Ownable {
    using SafeMath for uint256;
    LaunchpadCohort launchpadCohort;
    CollectLaunchpadInvestor cLI;
    LaunchpadHub iLH;
    using Counters for Counters.Counter;
    Counters.Counter private _tierIDs;

    mapping(uint => DataTypes.LaunchpadData) public launchpadDatas;
    mapping(uint => mapping(uint => DataTypes.TierData)) tierDetails;

    modifier onlyOwnerOf(address _addr, uint _id) {
        Launchpad launchpad = Launchpad(iLH.getLaunchpad(_id));
        require(
            launchpad.owner() == _addr,
            "Only owner of launchpad can call this function"
        );
        _;
    }

    constructor(address _launchpadCohort) {
        launchpadCohort = LaunchpadCohort(_launchpadCohort);
        launchpadCohort.setLaunchpadDatas(address(this));
        cLI = CollectLaunchpadInvestor(
            launchpadCohort.getAddrCollectInvestor()
        );
        iLH = LaunchpadHub(launchpadCohort.getAddrLaunchpadHub());
    }

    function getLaunchpadData(
        uint _id
    ) external view returns (DataTypes.LaunchpadData memory) {
        return launchpadDatas[_id];
    }

    function getTierData(
        uint _launchpadID,
        uint _tierID
    ) external view returns (DataTypes.TierData memory) {
        return tierDetails[_launchpadID][_tierID];
    }

    /**
     * @notice owner can change start time while session is not started
     * @param _saleStart new start time
     */
    function _setStartTime(
        uint256 _id,
        uint256 _saleStart
    ) external onlyOwnerOf(msg.sender, _id) {
        require(
            launchpadDatas[_id].saleStart > block.timestamp,
            "Sale already started"
        );
        require(_saleStart > block.timestamp, "Sale start cant be in the past");
        require(
            launchpadDatas[_id].saleEnd > _saleStart,
            "Sale start can't be more than end time"
        );
        launchpadDatas[_id].saleStart = _saleStart;
    }

    /**
     * @notice owner can change end time while session is not started
     * @param _saleEnd new end time
     */
    function _setEndTime(
        uint256 _id,
        uint256 _saleEnd
    ) external onlyOwnerOf(msg.sender, _id) {
        require(_saleEnd > block.timestamp, "Sale end can't be in the past");
        require(
            launchpadDatas[_id].saleStart < _saleEnd,
            "Sale end can't be less than start time"
        );
        launchpadDatas[_id].saleEnd = _saleEnd;
    }

    function setLaunchpadData(
        uint _launchpadID,
        address _ownerOf,
        DataTypes.LaunchpadData calldata _data
    ) external {
        if (launchpadDatas[_launchpadID].tokenAddress != address(0)) {
            require(
                launchpadDatas[_launchpadID].saleEnd < block.timestamp,
                "Launchpad already finished"
            );
            require(
                launchpadDatas[_launchpadID].saleStart > block.timestamp,
                "Launchpad already started"
            );
        }
        bool verified = InteractionLogic._checkLaunchpadData(_ownerOf, _data);
        require(verified, "Invalid launchpad data");
        launchpadDatas[_launchpadID] = _data;
    }

    function _addAmountRaised(
        uint _launchpadID,
        uint _tierID,
        uint _amount
    ) external {
        tierDetails[_launchpadID][uint8(_tierID)].amountRaised.add(_amount);
    }

    function _incrementLaunchpadUser(uint _launchpadID) external {
        launchpadDatas[_launchpadID].totalUser.add(1);
    }

    function _incrementTierUser(uint _launchpadID, uint _tierID) external {
        tierDetails[_launchpadID][uint8(_tierID)].users.add(1);
    }

    /**
     * @notice update tier datas will refresh your launchpad data for minCap, maxCap and tiersDetails
     * @param _tierLength number of tiers you want to provide
     * @param _maxTierCaps [] maximum amount of tokens that can be funded on this tier
     * @param _maxTierCaps [] minimum amount of tokens that can be funded on this tier
     * @param _tokenPrice [] amount of tokens per 1 token
     */
    function _setTiers(
        uint256 _tierLength,
        address _ownerOf,
        uint256 _id,
        uint256[] calldata _maxTierCaps,
        uint256[] calldata _minTierCaps,
        uint256[] calldata _tokenPrice
    ) public {
        require(
            launchpadDatas[_id].saleStart > block.timestamp,
            "Sale already started"
        );
        require(
            _tierLength == _maxTierCaps.length &&
                _tierLength == _minTierCaps.length &&
                _tokenPrice.length == _tierLength,
            "Mismatch datas tier"
        );
        uint256 totalMinCap;
        uint256 totalMaxCap;
        for (uint256 i = 0; i < _tierLength; i++) {
            require(
                _maxTierCaps[i] >= _minTierCaps[i] &&
                    _maxTierCaps[i] > 0 &&
                    _minTierCaps[i] > 0,
                "Mismatch data capitalization"
            );
            totalMinCap = totalMinCap.add(_minTierCaps[i]);
            totalMaxCap = totalMaxCap.add(_maxTierCaps[i]);
        }
        require(
            totalMinCap <= totalMaxCap,
            "Mismatch min and max capitalization"
        );
        require(
            totalMinCap > 0 && totalMaxCap > 0,
            "Capitalization need values"
        );

        for (uint256 i = 0; i < _tierLength; i++) {
            DataTypes.TierData memory _tierData;
            _tierData.maxTierCap = _maxTierCaps[i];
            _tierData.minTierCap = _minTierCaps[i];
            _tierData.tokenPrice = _tokenPrice[i];

            InteractionLogic._checkLaunchpadTierData(
                _tierData,
                i,
                iLH.maxTiers()
            );

            // fixed bug stack too large
            uint id_ = _id;
            tierDetails[id_][uint8(i)] = _tierData;
        }

        launchpadDatas[_id].numberOfTier = uint8(_tierLength);
        launchpadDatas[_id].minCap = totalMinCap;

        launchpadDatas[_id].maxCap = totalMaxCap;
    }

    function _checkAmount(
        uint _launchpadID,
        address _from,
        uint _tierID,
        uint _amount
    ) external view returns (bool) {
        require(
            _tierID < launchpadDatas[_launchpadID].numberOfTier,
            "Tier out of range"
        );
        uint256 _balance = tierDetails[_launchpadID][uint8(_tierID)]
            .amountRaised;

        require(
            tierDetails[_launchpadID][uint8(_tierID)].maxTierCap <=
                _balance.add(_amount),
            "Value out of range for this tier"
        );
        require(
            launchpadDatas[_launchpadID].minInvest < _amount,
            "Mismatches value and minimum investment"
        );
        uint256 _balanceOf = cLI
            .getInvestorData(_launchpadID, _from)
            .investedAmount;
        require(
            _balanceOf.add(_amount) <= launchpadDatas[_launchpadID].maxInvest,
            "Maximum investments out of range"
        );
        return true;
    }

    function _checkTierBalance(
        uint _launchpadID,
        uint _tierID
    ) external returns (bool) {
        if (
            tierDetails[_launchpadID][uint8(_tierID)].maxTierCap ==
            tierDetails[_launchpadID][uint8(_tierID)].amountRaised
        ) {} else {
            return true;
        }
    }
}
