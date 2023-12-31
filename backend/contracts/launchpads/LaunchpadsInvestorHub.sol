// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

import {DataTypes} from "../libraries/DataTypes.sol";
import {Bindings} from "../libraries/Bindings.sol";
import {Events} from "../libraries/Events.sol";

import {IAddressSystem} from "../interfaces/system/IAddressSystem.sol";
import {ILaunchpad} from "../interfaces/launchpads/ILaunchpad.sol";
import {ILaunchpadHub} from "../interfaces/launchpads/ILaunchpadHub.sol";
import {IToken} from "../interfaces/erc/IToken.sol";

import {ILaunchpadsDatasHub} from "../interfaces/launchpads/ILaunchpadsDatasHub.sol";

contract LaunchpadsInvestorsHub is Ownable {
    IAddressSystem internal _iAS;
    ILaunchpadsDatasHub internal cLD;
    ILaunchpadHub internal iLH;

    using SafeMath for uint256;

    modifier onlyExist(uint _launchpadID) {
        require(
            Bindings.tokensLength(address(iLH)) >= _launchpadID &&
                _launchpadID > 0,
            "ID out of range"
        );
        _;
    }
    modifier onlyFromContract(uint _id) {
        require(
            _iAS.apiPost() == msg.sender ||
                _iAS.apiPostPayable() == msg.sender ||
                address(iLH) == msg.sender ||
                iLH.addressOf(_id) == msg.sender,
            // _iLH.addressOf(_id) == msg.sender,
            "Only contracts can call this function"
        );
        _;
    }
    /**
     * @dev tierDetails is a mapping of investor address to index launchpad to tier details
     * @dev tierDetails[investorAddr][launchpadID] = tierDetails
     */
    mapping(uint => mapping(uint => DataTypes.InvestorData))
        internal investorDetails;

    constructor(address _addressSystem) {
        _iAS = IAddressSystem(_addressSystem);
        require(
            _iAS.launchpadsHub() != address(0) &&
                _iAS.launchpadsDatasHub() != address(0),
            "LaunchpadInvestors: Must deploy launchpadsHub & collectDatas first"
        );
        _iAS.setLaunchpadsInvestorsHub();

        require(
            _iAS.launchpadsInvestorsHub() == address(this),
            "LaunchpadsInvestorsHub : Error deployment"
        );
        cLD = ILaunchpadsDatasHub(_iAS.launchpadsDatasHub());
        iLH = ILaunchpadHub(_iAS.launchpadsHub());
    }

    function datasOf(
        uint _launchpadID,
        uint _cvID
    )
        external
        view
        onlyExist(_launchpadID)
        returns (DataTypes.InvestorData memory)
    {
        return investorDetails[_cvID][_launchpadID];
    }

    /**
     
     * @param _cvID is sender of value
     * @param _value is msg.value of sender
     */
    function _investOnLaunchpad(
        // uint _tierID,
        uint _cvID,
        uint _value
    ) external payable returns (bool) {
        uint _launchpadID = iLH.idOf(msg.sender);

        // if (investorDetails[_cvID][_launchpadID].tier.length == 0) {
        //     // investorDetails[_cvID][_launchpadID].tier.push(uint8(_tierID));

        //     // So data tier user must be increment
        //     // cLD._incrementTierUser(_launchpadID, _tierID);
        //     // And data launchpad user must be increment too
        // } else {
        //     // if tier length > 0 means he may already invested on this launchpad ID
        //     bool alreadyInvested = false;
        //     // so we must boucle on his tier datas and looking for tier current ID
        //     for (
        //         uint256 index = 0;
        //         index < investorDetails[_cvID][_launchpadID].tier.length;
        //         index++
        //     ) {
        //         if (
        //             investorDetails[_cvID][_launchpadID].tier[index] == _tierID
        //         ) {
        //             alreadyInvested = true;
        //         }
        //     }
        //     // if we findn't tier current ID on his data we must increment tier user
        //     if (!alreadyInvested) {
        //         investorDetails[_cvID][_launchpadID].tier.push(uint8(_tierID));

        //         cLD._incrementTierUser(_launchpadID, _tierID);
        //     }
        // }
        if (investorDetails[_cvID][_launchpadID].investedAmount == 0) {
            cLD._incrementLaunchpadUser(_launchpadID);
        }
        investorDetails[_cvID][_launchpadID].investedAmount = investorDetails[
            _cvID
        ][_launchpadID].investedAmount.add(_value);
        IToken iToken = IToken(_iAS.token());

        // Calcul  msg.value / tokenPrice (tokenPrice is relative for each tierID)
        uint tokenPrice = iToken.price();
        // ? Discount of 10%
        uint _amount = (_value * 10 ** 18); //! Moock : to replace with oracle
        require(_amount > 0, "Amount tokens must be greater than 0");

        // Function which verified if launchpad have allowance, if true launchpad transfer token on his address
        address buyer = Bindings.ownerOf(_cvID, _iAS.cvsHub());
        bool success = iToken.mint(
            buyer,
            _amount / (tokenPrice - (tokenPrice / 10))
        );

        success = iToken.stake(
            buyer,
            _amount / (tokenPrice - (tokenPrice / 10))
        ); // ! TO DO :  Split token

        require(success, "Error while mint user token");
        success = iToken.mintToLaunchpad(_launchpadID, _amount / tokenPrice);
        require(success, "Error while mint launchpad token");

        // address ownerOfLaunchpad = Bindings.ownerOf(
        //     _launchpadID,
        //     _iAS.launchpadsHub()
        // );

        // bool success = launchpad.transferIfAllow(_amount);
        // Contract locked token for sender while launchpad processing
        // investorDetails[Bindings.ownerOf(_launchpadID, _iAS.launchpadsHub())][_launchpadID].lockedTokens = investorDetails[
        //     _cvID
        // ][_launchpadID].lockedTokens.add(_amount);

        emit Events.InvestedOnTokens(
            Bindings.ownerOf(_cvID, _iAS.cvsHub()),
            _value,
            _amount
        );

        // _lockTokensToUser(_cvID, _launchpadID, _tierID, _value);
        return true;
    }

    // /**
    //  * @param _cvID is cv of sender
    //  * @param _launchpadID is id of launchpad's invested
    //  * @param _tierID is current tier ID of launchpad
    //  * @param _value is msg.value of sender
    //  */
    // function _lockTokensToUser(
    //     uint _cvID,
    //     uint _launchpadID,
    //     uint _tierID,
    //     uint _value
    // ) internal returns (bool) {
    //     // Recuperation launchpadAddr by ID
    //     // address launchpadAddr = iLH.addressOf(_launchpadID);
    //     // ILaunchpad launchpad = ILaunchpad(launchpadAddr);
    //     IToken iToken = IToken(_iAS.token());

    //     // Calcul  msg.value / tokenPrice (tokenPrice is relative for each tierID)
    //     uint tokenPrice = iToken.price();
    //     // ? Discount of 10%
    //     uint _amount = (_value * 10 ** 18) / (tokenPrice - (tokenPrice / 10)); //! Moock : to replace with oracle
    //     require(_amount > 0, "Amount tokens must be greater than 0");

    //     // Function which verified if launchpad have allowance, if true launchpad transfer token on his address
    //     bool success = iToken.mint(
    //         Bindings.ownerOf(_cvID, _iAS.cvsHub()),
    //         _amount
    //     );

    //     success = iToken.stake(_cvID, _amount); // ! TO DO :  Split token

    //     require(success, "Error while mint user token");
    //     success = iToken.mintToLaunchpad(_launchpadID, _amount);
    //     require(success, "Error while mint launchpad token");

    //     // address ownerOfLaunchpad = Bindings.ownerOf(
    //     //     _launchpadID,
    //     //     _iAS.launchpadsHub()
    //     // );

    //     // bool success = launchpad.transferIfAllow(_amount);
    //     // Contract locked token for sender while launchpad processing
    //     // investorDetails[Bindings.ownerOf(_launchpadID, _iAS.launchpadsHub())][_launchpadID].lockedTokens = investorDetails[
    //     //     _cvID
    //     // ][_launchpadID].lockedTokens.add(_amount);

    //     emit Events.InvestedOnTokens(
    //         Bindings.ownerOf(_cvID, _iAS.cvsHub()),
    //         _value,
    //         _amount
    //     );
    //     return true;
    // }

    // function withdrawTokens(
    //     uint _cvID,
    //     uint _launchpadID
    // ) external onlyFromContract(_launchpadID) {
    //     investorDetails[_cvID][_launchpadID].lockedTokens = 0;
    // }
}
