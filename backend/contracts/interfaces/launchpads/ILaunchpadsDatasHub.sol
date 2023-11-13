// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {DataTypes} from "../../libraries/DataTypes.sol";

interface ILaunchpadsDatasHub {
    function datasOf(
        uint _id
    ) external view returns (DataTypes.LaunchpadData memory);

    // function tierOf(
    //     uint _launchpadID,
    //     uint _tierID
    // ) external view returns (DataTypes.TierData memory);

    /**
     * @notice owner can change start time while session is not started
     * @param _saleStart new start time
     */
    function _setStartTime(uint256 _id, uint256 _saleStart) external;

    /**
     * @notice owner can change end time while session is not started
     * @param _saleEnd new end time
     */
    function _setEndTime(uint256 _id, uint256 _saleEnd) external;

    function setLaunchpadData(
        uint _launchpadID,
        DataTypes.LaunchpadData memory _data
    ) external;

    function setTokenURI(
        address _sender,
        uint _launchpadID,
        string memory _tokenURI
    ) external;

    function _addAmountRaised(
        uint _launchpadID,
        // uint _tierID,
        uint _amount
    ) external;

    function _incrementLaunchpadUser(uint _launchpadID) external;

    // function _incrementTierUser(uint _launchpadID, uint _tierID) external;

    // /**
    //  * @notice update tier datas will refresh your launchpad data for minCap, maxCap and tiersDetails
    //  * @param _tierLength number of tiers you want to provide
    //  * @param _maxTierCaps [] maximum amount of tokens that can be funded on this tier
    //  * @param _maxTierCaps [] minimum amount of tokens that can be funded on this tier
    //  * @param _tokenPrice [] amount of tokens per 1 token
    //  */
    // function _setTiers(
    //     uint256 _tierLength,
    //     uint256 _id,
    //     uint256[] calldata _maxTierCaps,
    //     uint256[] calldata _minTierCaps,
    //     uint256[] calldata _tokenPrice
    // ) external;

    // /**
    //  * @notice check if amount raised on tier is still on range
    //  * @notice value must be < maxTierCap && > minInvest  && balance of sender < maxInvest
    //  * @param _launchpadID id of invested launchpad
    //  * @param _cvID sender of value
    //  * @param _tierID is ID of current ID
    //  * @param _value is msg.value of sender
    //  */
    // function _checkAmount(
    //     uint _launchpadID,
    //     uint _cvID,
    //     uint _tierID,
    //     uint _value
    // ) external view returns (bool);

    // function _checkTierBalance(
    //     uint _launchpadID,
    //     uint _tierID
    // ) external returns (bool);
}
