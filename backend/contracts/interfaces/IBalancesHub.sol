// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

interface IBalancesHub {
    function missionPrice() external view returns (uint);

    function launchpadPrice() external view returns (uint);

    // Ajoutez votre code ici
}
