// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import {IAddressSystem} from "../interfaces/system/IAddressSystem.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract BalancesHub is Ownable {
    uint public missionPrice = 0.05 ether;
    uint public launchpadPrice = 0.4 ether;
    IAddressSystem private _iAS;
    using SafeMath for uint256;

    modifier onlyProxy() {
        require(
            _iAS.apiPost() == msg.sender || _iAS.apiPostPayable() == msg.sender,
            "Call this function with proxy bindings"
        );
        _;
    }

    // Is balance of ETH

    mapping(uint => uint) _balanceETHAccounts;

    constructor(address _addressSystem) {
        _iAS = IAddressSystem(_addressSystem);
        _iAS.setBalancesHub();
        require(
            _iAS.balancesHub() == address(this),
            "BalancesHub: Error deployment"
        );
    }

    function balanceOf(uint _cvID) external view returns (uint) {
        return _balanceETHAccounts[_cvID];
    }

    function addAccountBalance(
        uint _cvID,
        uint _amount
    ) external onlyProxy returns (bool) {
        _balanceETHAccounts[_cvID] = _balanceETHAccounts[_cvID].add(_amount);
        return true;
    }

    function withdrawAccountBalance(
        uint _cvID,
        uint _value
    ) external onlyProxy returns (bool) {
        require(
            _balanceETHAccounts[_cvID] >= _value &&
                _balanceETHAccounts[_cvID].sub(_value) >= 0,
            "BalancesHub: Error value"
        );
        _balanceETHAccounts[_cvID] = _balanceETHAccounts[_cvID].sub(_value);
        return true;
    }
}
