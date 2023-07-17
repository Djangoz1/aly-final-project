// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

import {DataTypes} from "../libraries/DataTypes.sol";
import {IAccessControl} from "../interfaces/IAccessControl.sol";
import {ILaunchpad} from "../interfaces/ILaunchpad.sol";
import {LaunchpadHub} from "../storage/LaunchpadHub.sol";
import {LaunchpadCohort} from "../cohort/LaunchpadCohort.sol";
import {CollectLaunchpadDatas} from "../collect/CollectLaunchpadDatas.sol";

contract CollectLaunchpadInvestor is Ownable {
    LaunchpadCohort launchpadCohort;
    CollectLaunchpadDatas cLD;

    using SafeMath for uint256;

    /**
     * @dev tierDetails is a mapping of investor address to index launchpad to tier details
     * @dev tierDetails[investorAddr][launchpadID] = tierDetails
     */
    mapping(address => mapping(uint => DataTypes.InvestorData))
        public investorDetails;

    constructor(address _launchpadCohort) {
        launchpadCohort = LaunchpadCohort(_launchpadCohort);
        launchpadCohort.setLaunchpadInvestor(address(this));
        cLD = CollectLaunchpadDatas(launchpadCohort.getAddrCollectDatas());
    }

    /**
     * @notice check if contract have allowance to transfered that amount
     * check if owner have enough funds
     * if not, the protocol paused automatically this contract
     */
    function _hasAllowance(
        uint _amount,
        uint _launchpadID
    ) internal returns (bool) {
        IERC20 token = IERC20(cLD.getLaunchpadData(_launchpadID).tokenAddress);
        uint valueAllowed = token.allowance(owner(), msg.sender);
        require(valueAllowed > 0, "Our funds is empty");
        require(
            valueAllowed >= _amount,
            "We didn't have enough funds available"
        );
        if (token.balanceOf(owner()) <= valueAllowed) {
            // _pause();
            require(
                token.balanceOf(owner()) >= valueAllowed,
                "Mismatch balance of owner and allowance !"
            );
        } else {
            return true;
        }
    }

    function getInvestorData(
        uint _launchpadID,
        address _investor
    ) external view returns (DataTypes.InvestorData memory) {
        return investorDetails[_investor][_launchpadID];
    }

    function _investOnLaunchpad(
        uint _launchpadID,
        uint _tierID,
        address _from,
        uint _amount
    ) external payable returns (bool) {
        if (
            investorDetails[_from][_launchpadID].tier.length == 0 &&
            investorDetails[_from][_launchpadID].investedAmount == 0
        ) {
            investorDetails[_from][_launchpadID].tier.push(uint8(_tierID));
            investorDetails[_from][_launchpadID].investedAmount.add(_amount);
            cLD._incrementTierUser(_launchpadID, _tierID);
            cLD._incrementLaunchpadUser(_launchpadID);
        } else {
            bool alreadyInvested = false;

            for (
                uint256 index = 0;
                index < investorDetails[_from][_launchpadID].tier.length;
                index++
            ) {
                if (
                    investorDetails[_from][_launchpadID].tier[index] == _tierID
                ) {
                    investorDetails[_from][_launchpadID].investedAmount.add(
                        _amount
                    );
                    alreadyInvested = true;
                }
            }
            if (!alreadyInvested) {
                investorDetails[_from][_launchpadID].investedAmount.add(
                    _amount
                );

                cLD._incrementTierUser(_launchpadID, _tierID);
            }
        }

        _lockTokensToUser(_from, _launchpadID, _tierID, _amount);
        return true;
    }

    function _lockTokensToUser(
        address _to,
        uint _launchpadID,
        uint _tierID,
        uint _value
    ) internal returns (bool) {
        IERC20 token = IERC20(cLD.getLaunchpadData(_launchpadID).tokenAddress);
        require(_value > 0, "Amount must be greater than 0");
        uint _amount = _value.div(
            cLD.getTierData(_launchpadID, _tierID).tokenPrice
        );
        _hasAllowance(_amount, _launchpadID);
        require(_to != address(0), "ERC20: lock to the zero address");
        require(_amount > 0, "Amount tokens must be greater than 0");
        token.transferFrom(owner(), address(this), _amount);
        investorDetails[_to][_launchpadID].lockedTokens.add(_amount);
        return true;
    }
}
