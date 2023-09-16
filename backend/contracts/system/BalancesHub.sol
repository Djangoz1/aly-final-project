// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import {IAddressSystem} from "../interfaces/system/IAddressSystem.sol";

contract BalancesHub is Ownable {
    uint public missionPrice = 0.05 ether;
    uint public launchpadPrice = 0.4 ether;
    IAddressSystem private _iAS;

    constructor(address _addressSystem) {
        _iAS = IAddressSystem(_addressSystem);
        _iAS.setBalancesHub();
        require(
            _iAS.balancesHub() == address(this),
            "BalancesHub: Error deployment"
        );
    }
}
