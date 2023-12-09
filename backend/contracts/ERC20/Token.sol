// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

import {DataTypes} from "../libraries/DataTypes.sol";
import {IAddressSystem} from "../interfaces/system/IAddressSystem.sol";
import {IAPIGet} from "../interfaces/system/IAPIGet.sol";
import "../interfaces/fork/IUniswapV2Router02.sol";
import "../interfaces/fork/IUniswapV2Factory.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract Token is ERC20, Ownable {
    // Ajoutez votre code ici

    using SafeMath for uint256;

    uint public totalStaked;
    uint public price = 2000 wei; // ! moock price - to delete
    IAddressSystem _iAS;

    bytes32 public DOMAIN_SEPARATOR;
    // keccak256("Permit(address owner,address spender,uint256 value,uint256 nonce,uint256 deadline)");
    bytes32 public constant PERMIT_TYPEHASH =
        0x6e71edae12b1b97f4d1f60370fef10105fa2faae0126114a169c64845d6126c9;
    mapping(address => uint) public nonces;

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

    constructor(address _addressSystem) ERC20("DeWork", "DeW") {
        _iAS = IAddressSystem(_addressSystem);
        _iAS.setToken();
        uint chainId;
        assembly {
            chainId := chainid()
        }
        DOMAIN_SEPARATOR = keccak256(
            abi.encode(
                keccak256(
                    "EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"
                ),
                keccak256(bytes("DeWork")),
                keccak256(bytes("1")),
                chainId,
                address(this)
            )
        );

        _mint(msg.sender, 1000000 * 10 ** 18);
    }

    function mint(address _to, uint _amount) external onlyProxy returns (bool) {
        _mint(_to, _amount);
        return true;
    }

    function getPair(
        address _factory,
        address _tokenB
    ) external view returns (address) {
        return IUniswapV2Factory(_factory).getPair(address(this), _tokenB);
    }

    function initPool(
        address _router,
        address _factory,
        address _weth
    ) external {
        IERC20 weth = IERC20(_weth);
        IUniswapV2Factory factory = IUniswapV2Factory(_factory);
        factory.createPair(address(this), _weth);
        uint amountTokenA = 1 ether;
        uint amountTokenB = 0.5 ether;
        IUniswapV2Router02 router = IUniswapV2Router02(_router);
        approve(_router, amountTokenA);
        weth.approve(_router, amountTokenB);
        // Approbation pour le router d'utiliser nos tokens
        router.addLiquidity(
            address(this),
            _weth,
            amountTokenA,
            amountTokenB,
            0,
            0,
            owner(),
            block.timestamp + block.timestamp
        );
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
