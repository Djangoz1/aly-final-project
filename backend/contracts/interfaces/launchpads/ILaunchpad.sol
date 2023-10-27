// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {DataTypes} from "../../libraries/DataTypes.sol";

interface ILaunchpad {
    function setLaunchpadInvestor(address _launchpadInvestor) external;

    function owner() external view returns (address);

    function status() external view returns (DataTypes.LaunchpadStatus);

    function withdrawOwner(uint _value, address _to) external returns (bool);

    /**
     * @notice check if contract have allowance to transfered that amount
     * check if owner have enough funds
     * if not, the protocol paused automatically this contract
     * @param _tokens is number of token that sender buy
     */
    function transferIfAllow(uint _tokens) external returns (bool);

    /**
     * @notice must be call after ERC20.approve(address(this) amount)
     * @notice protocol take 1% royalties
     * @param _tokens must be equal of the allowance of contract for sender address
     */
    function lockTokens(uint _cvID, uint _tokens) external;

    function getCurrentTierID() external view returns (uint8);

    function dataOfs() external view returns (DataTypes.LaunchpadData memory);

    function setTimer(uint _saleEnd, uint _saleStart) external;

    function getTokenSupply() external view returns (uint);

    function setTierID() external;

    /**
     * @notice LaunchpadsDatasHub documentation
     * @param _tierIDs is length of tier set
     * @param _maxTierCaps is an array of max tier caps value for each tier. Length must be equal at _tierIDs
     * @param _minTierCaps is an array of min tier caps value for each tier. Length must be equal at _tierIDs
     * @param _amountPerToken is an array of amount per token for each tier. Length must be equal at _tierIDs
     */
    function setTiers(
        uint8 _tierIDs,
        uint256[] calldata _maxTierCaps,
        uint256[] calldata _minTierCaps,
        uint256[] calldata _amountPerToken
    ) external;

    // *::::::::: ------------- :::::::::* //
    // *::::::::: USER BINDINGS :::::::::* //
    // *::::::::: ------------- :::::::::* //

    function buyTokens(uint _cvSender, uint _value) external;

    function withdrawTokens(uint _cvID) external;
}
