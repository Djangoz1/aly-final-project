// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import {DataTypes} from "../libraries/DataTypes.sol";
import {BindingsMint} from "../libraries/BindingsMint.sol";
import {IAccessControl} from "../interfaces/system/IAccessControl.sol";
import {IAddressSystem} from "../interfaces/system/IAddressSystem.sol";
import {Dispute} from "../escrow/Dispute.sol";
import {DisputeDatas} from "../libraries/disputes/DisputeDatas.sol";

contract Factory is Ownable {
    IAddressSystem iAH;

    constructor(address _addressSystem) {
        iAH = IAddressSystem(_addressSystem);
        iAH.setFactory();
    }

    function mintDispute(
        address _to,
        DisputeDatas.Data memory _data
    ) external returns (address) {
        return address(new Dispute(address(iAH), _to, _data));
    }

    // Ajoutez votre code ici
}
