// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import {IAddressSystem} from "../interfaces/system/IAddressSystem.sol";
import {ICVsHub} from "../interfaces/cv/ICVsHub.sol";
import {DataTypes} from "../libraries/DataTypes.sol";

contract CVsDatasHub is Ownable {
    using Counters for Counters.Counter;

    /**
     * ! TO DELETE ?
     * @notice use db for follows now
     */

    IAddressSystem private _iAS;

    ICVsHub private _iCVH;

    modifier onlyProxy() {
        require(
            msg.sender == address(_iAS.apiPost()),
            "Must call function with hub bindings"
        );
        _;
    }

    constructor(address _addressSystem) {
        _iAS = IAddressSystem(_addressSystem);
        require(_iAS.cvsHub() != address(0), "Deployed CVsHub first");
        _iCVH = ICVsHub(_iAS.cvsHub());
        _iAS.setCVsDatasHub();
        require(
            _iAS.cvsDatasHub() == address(this),
            "CVsDatasHub : Error deployment"
        );
    }

    //
}
