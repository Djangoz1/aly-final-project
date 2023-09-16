// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

import {DataTypes} from "../libraries/DataTypes.sol";
import {IAccessControl} from "../interfaces/system/IAccessControl.sol";

contract ERC20Token is ERC20 {
    // Ajoutez votre code ici

    constructor(
        string memory _name,
        string memory _symbol,
        uint _supply
    ) ERC20(_name, _symbol) {
        _mint(msg.sender, _supply);
    }
}
