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

    // Ajoutez votre code ici
}
