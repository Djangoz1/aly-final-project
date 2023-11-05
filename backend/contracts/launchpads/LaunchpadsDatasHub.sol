// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

import {DataTypes} from "../libraries/DataTypes.sol";
import {InteractionLogic} from "../libraries/InteractionLogic.sol";

import {IAddressSystem} from "../interfaces/system/IAddressSystem.sol";
import {ILaunchpad} from "../interfaces/launchpads/ILaunchpad.sol";
import {ILaunchpadHub} from "../interfaces/launchpads/ILaunchpadHub.sol";
import {ILaunchpadsInvestorsHub} from "../interfaces/launchpads/ILaunchpadsInvestorsHub.sol";

contract LaunchpadsDatasHub is Ownable {
    using SafeMath for uint256;

    ILaunchpadHub private _iLH;
    IAddressSystem private _iAS;
    using Counters for Counters.Counter;
    Counters.Counter private _tierIDs;

    mapping(uint => DataTypes.LaunchpadData) internal launchpadDatas;
    mapping(uint => mapping(uint => DataTypes.TierData)) internal tierDetails;

    mapping(uint => bytes) internal _tokensURI;

    modifier onlyFromContract(uint _id) {
        require(
            _iAS.apiPost() == msg.sender ||
                _iAS.apiPostPayable() == msg.sender ||
                address(_iLH) == msg.sender ||
                address(_iAS.launchpadsInvestorsHub()) == msg.sender ||
                _iLH.addressOf(_id) == msg.sender,
            // _iLH.addressOf(_id) == msg.sender,
            "Only contracts can call this function"
        );
        _;
    }

    modifier onlyOwnerOf(address _sender, uint _launchpadID) {
        require(
            ILaunchpad(_iLH.addressOf(_launchpadID)).owner() == _sender,
            "Not the owner"
        );
        _;
    }

    constructor(address _addressSystem) {
        _iAS = IAddressSystem(_addressSystem);
        require(
            _iAS.launchpadsHub() != address(0),
            "Must deploy launchpadsHub first"
        );
        _iAS.setLaunchpadsDatasHub();
        require(
            _iAS.launchpadsDatasHub() == address(this),
            "LaunchpadsDatasHub : Error deployment"
        );
        _iLH = ILaunchpadHub(_iAS.launchpadsHub());
    }

    function datasOf(
        uint _id
    ) external view returns (DataTypes.LaunchpadData memory) {
        return launchpadDatas[_id];
    }

    function tierOf(
        uint _launchpadID,
        uint _tierID
    ) external view returns (DataTypes.TierData memory) {
        return tierDetails[_launchpadID][_tierID];
    }

    function setTokenURI(
        address _sender,
        uint _launchpadID,
        string memory tokenURI_
    )
        external
        onlyOwnerOf(_sender, _launchpadID)
        onlyFromContract(_launchpadID)
    {
        _tokensURI[_launchpadID] = bytes(tokenURI_);
    }

    function tokenURI(
        uint _launchpadID
    ) external view returns (string memory _tokenURI) {
        return string(_tokensURI[_launchpadID]);
    }

    /**
     *
     */
    function setLaunchpadData(
        uint _launchpadID,
        address _ownerOf,
        DataTypes.LaunchpadData calldata _data
    ) external onlyFromContract(_launchpadID) {
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
    ) external onlyFromContract(_launchpadID) {
        uint amountRaised = tierDetails[_launchpadID][_tierID].amountRaised;

        require(
            launchpadDatas[_launchpadID].numberOfTier > _tierID &&
                tierDetails[_launchpadID][_tierID].maxTierCap >=
                tierDetails[_launchpadID][_tierID].amountRaised.add(_amount),
            "AddAmount: Error tier value"
        );
        tierDetails[_launchpadID][_tierID].amountRaised = amountRaised.add(
            _amount
        );
    }

    function _incrementLaunchpadUser(
        uint _launchpadID
    ) external onlyFromContract(_launchpadID) {
        launchpadDatas[_launchpadID].totalUser = launchpadDatas[_launchpadID]
            .totalUser
            .add(1);
    }

    function _incrementTierUser(
        uint _launchpadID,
        uint _tierID
    ) external onlyFromContract(_launchpadID) {
        tierDetails[_launchpadID][_tierID].users = tierDetails[_launchpadID][
            _tierID
        ].users.add(1);
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
        uint256 _id,
        uint256[] calldata _maxTierCaps,
        uint256[] calldata _minTierCaps,
        uint256[] calldata _tokenPrice
    ) public onlyFromContract(_id) {
        require(
            launchpadDatas[_id].saleStart > block.timestamp ||
                msg.sender == _iAS.apiPost(),
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

        for (uint256 i = 0; i < _tierLength; i++) {
            DataTypes.TierData memory _tierData;
            _tierData.maxTierCap = _maxTierCaps[i];
            _tierData.minTierCap = _minTierCaps[i];
            _tierData.tokenPrice = _tokenPrice[i];

            InteractionLogic._checkLaunchpadTierData(
                _tierData,
                i,
                _iLH.maxTiers()
            );

            // fixed bug stack too large
            uint id_ = _id;
            tierDetails[id_][i] = _tierData;
        }
    }

    /**
     * @notice check if amount raised on tier is still on range
     * @notice value must be < maxTierCap && > minInvest  && balance of sender < maxInvest
     * @param _launchpadID id of invested launchpad
     * @param _cvID sender of value
     * @param _tierID is ID of current ID
     * @param _value is msg.value of sender
     */
    function _checkAmount(
        uint _launchpadID,
        uint _cvID,
        uint _tierID,
        uint _value
    ) external view returns (bool) {
        require(
            _tierID < launchpadDatas[_launchpadID].numberOfTier,
            "Tier out of range"
        );

        // require(
        //     tierDetails[_launchpadID][_tierID].maxTierCap + tierDetails[_launchpadID][] >=
        //         tierDetails[_launchpadID][_tierID].amountRaised.add(_value),
        //     "Value out of range for this tier"
        // );
        uint256 _balanceOf = ILaunchpadsInvestorsHub(
            _iAS.launchpadsInvestorsHub()
        ).datasOf(_launchpadID, _cvID).investedAmount;

        require(
            launchpadDatas[_launchpadID].minInvest <= _balanceOf.add(_value) &&
                _balanceOf.add(_value) <=
                launchpadDatas[_launchpadID].maxInvest,
            "Value not in range invest"
        );

        return true;
    }

    function _checkTierBalance(
        uint _launchpadID,
        uint _tierID
    ) external returns (bool) {
        if (
            tierDetails[_launchpadID][_tierID].amountRaised >=
            tierDetails[_launchpadID][_tierID].maxTierCap
        ) {
            return false;
        } else {
            return true;
        }
    }
}
