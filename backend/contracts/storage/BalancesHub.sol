// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import {IAddressHub} from "../interfaces/IAddressHub.sol";

contract BalancesHub {
    uint public missionPrice = 0.05 ether;
    uint public launchpadPrice = 0.4 ether;
    IAddressHub _iAH;

    constructor(address _addressHub) {
        _iAH = IAddressHub(_addressHub);
        _iAH.setBalancesHub();
    }

    // Ajoutez votre code ici
}
