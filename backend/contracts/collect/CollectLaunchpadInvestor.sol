// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

// import "hardhat/console.sol";

import {DataTypes} from "../libraries/DataTypes.sol";
import {Events} from "../libraries/Events.sol";
import {Launchpad} from "../launchpad/Launchpad.sol";
import {ILaunchpadHub} from "../interfaces/ILaunchpadHub.sol";
import {LaunchpadCohort} from "../cohort/LaunchpadCohort.sol";
import {CollectLaunchpadDatas} from "../collect/CollectLaunchpadDatas.sol";

contract CollectLaunchpadInvestor is Ownable {
    LaunchpadCohort internal launchpadCohort;
    CollectLaunchpadDatas internal cLD;
    ILaunchpadHub internal iLH;

    using SafeMath for uint256;

    /**
     * @dev tierDetails is a mapping of investor address to index launchpad to tier details
     * @dev tierDetails[investorAddr][launchpadID] = tierDetails
     */
    mapping(address => mapping(uint => DataTypes.InvestorData))
        internal investorDetails;

    constructor(address _launchpadCohort) {
        launchpadCohort = LaunchpadCohort(_launchpadCohort);
        launchpadCohort.setLaunchpadInvestor(address(this));
        cLD = CollectLaunchpadDatas(launchpadCohort.getAddrCollectDatas());
        cLD.setCollectInvestor(address(this));
        iLH = ILaunchpadHub(launchpadCohort.getAddrLaunchpadHub());
    }

    function getInvestorData(
        uint _launchpadID,
        address _investor
    ) external view returns (DataTypes.InvestorData memory) {
        return investorDetails[_investor][_launchpadID];
    }

    /**
     * @param _launchpadID is ID of invested launchpad
     * @param _tierID is ID of current tier ID
     * @param _from is sender of value
     * @param _value is msg.value of sender
     */
    function _investOnLaunchpad(
        uint _launchpadID,
        uint _tierID,
        address _from,
        uint _value
    ) external payable returns (bool) {
        // if tier.length == 0 means is not invest
        if (investorDetails[_from][_launchpadID].tier.length == 0) {
            investorDetails[_from][_launchpadID].tier.push(uint8(_tierID));
            // So data tier user must be increment
            cLD._incrementTierUser(_launchpadID, _tierID);
            // And data launchpad user must be increment too
            cLD._incrementLaunchpadUser(_launchpadID);
        } else {
            // if tier length > 0 means he may already invested on this launchpad ID
            bool alreadyInvested = false;
            // so we must boucle on his tier datas and looking for tier current ID
            for (
                uint256 index = 0;
                index < investorDetails[_from][_launchpadID].tier.length;
                index++
            ) {
                if (
                    investorDetails[_from][_launchpadID].tier[index] == _tierID
                ) {
                    alreadyInvested = true;
                }
            }
            // if we findn't tier current ID on his data we must increment tier user
            if (!alreadyInvested) {
                cLD._incrementTierUser(_launchpadID, _tierID);
            }
        }

        investorDetails[_from][_launchpadID].investedAmount = investorDetails[
            _from
        ][_launchpadID].investedAmount.add(_value);
        _lockTokensToUser(_from, _launchpadID, _tierID, _value);
        return true;
    }

    /**
     * @param _to is address of sender
     * @param _launchpadID is id of launchpad's invested
     * @param _tierID is current tier ID of launchpad
     * @param _value is msg.value of sender
     */
    function _lockTokensToUser(
        address _to,
        uint _launchpadID,
        uint _tierID,
        uint _value
    ) internal returns (bool) {
        // Recuperation launchpadAddr by ID
        address launchpadAddr = iLH.getLaunchpad(_launchpadID);
        Launchpad launchpad = Launchpad(launchpadAddr);
        require(_value > 0, "Amount must be greater than 0");
        require(_to != address(0), "cant lock to the zero address");

        // Calcul  msg.value / tokenPrice (tokenPrice is relative for each tierID)
        uint _amount = _value.div(
            cLD.getTierData(_launchpadID, _tierID).tokenPrice
        );
        require(_amount > 0, "Amount tokens must be greater than 0");

        // Function which verified if launchpad have allowance, if true launchpad transfer token on his address
        bool success = launchpad.transferIfAllow(_amount);
        require(success, "Error while recuperation token");

        // Contract locked token for sender while launchpad processing
        investorDetails[_to][_launchpadID].lockedTokens = investorDetails[_to][
            _launchpadID
        ].lockedTokens.add(_amount);

        emit Events.InvestedOnTokens(_to, _value, _amount);
        return true;
    }
}
