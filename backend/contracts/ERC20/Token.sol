// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

import {DataTypes} from "../libraries/DataTypes.sol";
import {IAddressSystem} from "../interfaces/system/IAddressSystem.sol";
import {IAPIGet} from "../interfaces/system/IAPIGet.sol";

import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract Token is ERC20, Ownable {
    // Ajoutez votre code ici

    using SafeMath for uint256;
    uint public constant INITIAL_SUPPLY = 1000000;
    uint public totalStaked;
    uint public price = 2000 wei; // ! moock price - to delete
    IAddressSystem _iAS;

    mapping(address => uint) _stake;

    modifier onlyProxy() {
        require(
            msg.sender == _iAS.apiPost() ||
                msg.sender == _iAS.apiPostPayable() ||
                _iAS.launchpadsInvestorsHub() == msg.sender,
            "Must call function with proxy bindings"
        );
        _;
    }

    constructor(address _addressSystem) ERC20("DeWork", "DEW") {
        _iAS = IAddressSystem(_addressSystem);
        _iAS.setToken();
        _mint(msg.sender, INITIAL_SUPPLY * 10 ** 18);
    }

    function mint(address _to, uint _amount) external onlyProxy returns (bool) {
        _mint(_to, _amount);
        return true;
    }

    function mintToLaunchpad(
        uint _launchpadID,
        uint _amount
    ) external onlyProxy returns (bool) {
        address launchpadAddr = IAPIGet(_iAS.apiGet()).addressOfLaunchpad(
            _launchpadID
        );
        _mint(launchpadAddr, _amount);
        _approve(launchpadAddr, _iAS.apiPost(), _amount);
        return true;
    }

    function stake(
        address _to,
        uint _amount
    ) external onlyProxy returns (bool) {
        _transfer(_to, address(this), _amount);
        _stake[_to] = _stake[_to].add(_amount);
        totalStaked = totalStaked.add(_amount);
        // ! TO DO PROGRAM STAKING
        return true;
    }

    function staked(address _to) external view returns (uint) {
        return _stake[_to];
    }

    function unstake(
        address _to,
        uint _amount
    ) external onlyProxy returns (bool) {
        require(
            _stake[_to] >= _amount && _stake[_to].sub(_amount) >= 0,
            "BalancesHub: Error value"
        );

        _transfer(address(this), _to, _amount);
        _stake[_to] = _stake[_to].sub(_amount);
        totalStaked = totalStaked.sub(_amount);

        // ! TO DO PROGRAM STAKING

        return true;
    }

    function paid(
        address _from,
        address _to,
        uint _amount
    ) external onlyProxy returns (bool) {
        require(balanceOf(_from) >= _amount, "Not enough funds");
        _transfer(_from, _to, _amount);
        return true;
    }
}
