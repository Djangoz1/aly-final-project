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
            _iAS.apiPost() == msg.sender,
            "Call this function with proxy bindings"
        );
        _;
    }

    mapping(uint => uint) _balanceLaunchpads;

    constructor(address _addressSystem) {
        _iAS = IAddressSystem(_addressSystem);
        _iAS.setBalancesHub();
        require(
            _iAS.balancesHub() == address(this),
            "BalancesHub: Error deployment"
        );
    }

    function launchpadBalance(uint _launchpadID) external view returns (uint) {
        return _balanceLaunchpads[_launchpadID];
    }

    function addLaunchpadBalance(
        uint _launchpadID,
        uint _value
    ) external onlyProxy returns (bool) {
        _balanceLaunchpads[_launchpadID] = _balanceLaunchpads[_launchpadID].add(
            _value
        );
        return true;
    }

    function withdrawLaunchpadBalance(
        uint _launchpadID,
        uint _value
    ) external onlyProxy returns (bool) {
        require(
            _balanceLaunchpads[_launchpadID] >= _value &&
                _balanceLaunchpads[_launchpadID].sub(_value) >= 0,
            "BalancesHub: Error value"
        );
        _balanceLaunchpads[_launchpadID] = _balanceLaunchpads[_launchpadID].sub(
            _value
        );
        return true;
    }
}
