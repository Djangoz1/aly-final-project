// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

interface IBalancesHub {
    function missionPrice() external view returns (uint);

    function launchpadPrice() external view returns (uint);

    function launchpadBalance(uint _launchpadID) external view returns (uint);

    function addLaunchpadBalance(
        uint _launchpadID,
        uint _value
    ) external returns (bool);

    function withdrawLaunchpadBalance(
        uint _launchpadID,
        uint _value
    ) external returns (bool);

    function balanceOf(uint _cvID) external view returns (uint);

    function addAccountBalance(
        uint _cvID,
        uint _amount
    ) external returns (bool);

    function withdrawAccountBalance(
        uint _cvID,
        uint _value
    ) external returns (bool);

    // Ajoutez votre code ici
}
