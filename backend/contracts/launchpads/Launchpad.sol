// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
// import "@openzeppelin/contracts/security/Pausable.sol";
// import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

import {Bindings} from "../libraries/Bindings.sol";
import {DataTypes} from "../libraries/DataTypes.sol";

import {IAddressSystem} from "../interfaces/system/IAddressSystem.sol";
import {ILaunchpadsInvestorsHub} from "../interfaces/launchpads/ILaunchpadsInvestorsHub.sol";
import {ILaunchpadsDatasHub} from "../interfaces/launchpads/ILaunchpadsDatasHub.sol";
import {ILaunchpadHub} from "../interfaces/launchpads/ILaunchpadHub.sol";

contract Launchpad is Ownable {
    ILaunchpadsDatasHub private cLD;
    ILaunchpadsInvestorsHub private cLI;
    IAddressSystem private _iAS;

    using Counters for Counters.Counter;
    Counters.Counter private _tierID;
    using SafeMath for uint256;

    uint internal _id;

    bool private _royaltiesTaken;

    IERC20 private iERC20;

    DataTypes.LaunchpadStatus public status;

    modifier onlyStatus(DataTypes.LaunchpadStatus _status) {
        require(status == _status, "Wrong status step expected");
        _;
    }

    modifier onlyProxy() {
        require(
            msg.sender == address(_iAS.apiPost()),
            "Must call function with proxy bindings"
        );
        _;
    }

    modifier onlyProcess() {
        // ! Decoment after test

        // require(
        //     block.timestamp > cLD.datasOf(datas_(.s).id,aleStart,
        //     "Sale not started"
        // );
        // ! @@@@@@

        require(block.timestamp < _datas().saleEnd, "Sale already ended");
        _;
    }

    constructor(
        address _addressSystem,
        address _owner,
        uint256 id_,
        address _tokenAddress
    ) {
        transferOwnership(_owner);
        _iAS = IAddressSystem(_addressSystem);
        require(msg.sender == _iAS.launchpadsHub());
        iERC20 = IERC20(_tokenAddress);
        _id = id_;
    }

    /**
     * @notice check if contract have allowance to transfered that amount
     * check if owner have enough funds
     * if not, the protocol paused automatically this contract
     * @param _tokens is number of token that sender buy
     */
    function transferIfAllow(uint _tokens) external returns (bool) {
        uint valueAllowed = iERC20.allowance(owner(), address(this));
        require(valueAllowed > 0, "Our funds is empty");
        require(
            valueAllowed >= _tokens,
            "We didn't have enough funds available"
        );
        if (iERC20.balanceOf(owner()) <= valueAllowed) {
            // _pause();
            require(
                iERC20.balanceOf(owner()) >= valueAllowed,
                "Mismatch balance of owner and allowance !"
            );
        } else {
            bool success = iERC20.transferFrom(owner(), address(this), _tokens);
            require(success, "Error transfer token");
            return true;
        }
    }

    // *::::::::: ---------------- :::::::::* //
    // *::::::::: STATE MANAGEMENT :::::::::* //
    // *::::::::: ---------------- :::::::::* //

    // function pause() external onlyOwner {
    //     _pause();
    // }

    // function unpause() external onlyOwner {
    //     _unpause();
    // }

    /**
     * @notice must be call after ERC20.approve(address(this) amount)
     * @notice protocol take 1% royalties
     * @param _tokens must be equal of the allowance of contract for sender address
     */
    function lockTokens(uint _cvID, uint _tokens) external onlyProxy {
        address sender = Bindings.ownerOf(_cvID, _iAS.cvsHub());
        require(sender == owner(), "Ownable: caller is not the owner");
        require(iERC20.balanceOf(sender) >= _tokens, "No enough funds");
        require(
            iERC20.allowance(sender, address(this)) == _tokens,
            "Mismatch allowance amount"
        );
        uint royalties = _tokens.div(100);
        bool success = iERC20.transferFrom(
            sender,
            address(ILaunchpadHub(_iAS.launchpadsHub()).owner()),
            royalties
        );
        require(success, "Royalties can't be transferred");
        status = DataTypes.LaunchpadStatus.Init;
    }

    function getCurrentTierID() external view returns (uint) {
        return _tierID.current();
    }

    function _datas() internal view returns (DataTypes.LaunchpadData memory) {
        return cLD.datasOf(_id);
    }

    function tierOfs(
        uint _tierID
    ) external view returns (DataTypes.TierData memory) {
        DataTypes.LaunchpadData memory _lData = _datas();
        require(_lData.numberOfTier > _tierID, "tierID out of range");
        return cLD.tierOf(_id, _tierID);
    }

    function setTimer(uint _saleEnd, uint _saleStart) external onlyOwner {
        cLD._setStartTime(_id, _saleStart);
        cLD._setEndTime(_id, _saleEnd);
    }

    function getTokenSupply() external view returns (uint) {
        uint amount = iERC20.allowance(owner(), address(this));
        require(
            iERC20.balanceOf(owner()) >= amount,
            "Mismatch allowance and owner funds"
        );
        return amount;
    }

    function setTierID() external onlyOwner {
        _setTierID();
    }

    function _setTierID() private onlyProcess {
        uint tierID_ = _tierID.current().add(1);
        DataTypes.TierData memory _tierData = cLD.tierOf(
            _id,
            _tierID.current()
        );
        require(
            _tierData.minTierCap <= _tierData.amountRaised,
            "Must have minimum cap to set tierID"
        );
        require(_datas().numberOfTier >= tierID_, "out of range");
        _tierID.increment();
    }

    /**
     * @notice LaunchpadsDatasHub documentation
     * @param _tierIDs is length of tier set
     * @param _maxTierCaps is an array of max tier caps value for each tier. Length must be equal at _tierIDs
     * @param _minTierCaps is an array of min tier caps value for each tier. Length must be equal at _tierIDs
     * @param _amountPerToken is an array of amount per token for each tier. Length must be equal at _tierIDs
     */
    function setTiers(
        uint8 _tierIDs,
        uint256[] calldata _maxTierCaps,
        uint256[] calldata _minTierCaps,
        uint256[] calldata _amountPerToken
    ) external onlyOwner {
        cLD._setTiers(
            _tierIDs,
            msg.sender,
            _id,
            _maxTierCaps,
            _minTierCaps,
            _amountPerToken
        );
    }

    // *::::::::: ------------- :::::::::* //
    // *::::::::: USER BINDINGS :::::::::* //
    // *::::::::: ------------- :::::::::* //

    function buyTokens()
        external
        payable
        onlyStatus(DataTypes.LaunchpadStatus.Init)
        onlyProcess
    {
        // whenNotPaused

        // ! faire un test has registred
        Bindings.cvOf(msg.sender, _iAS.cvsHub());
        // ! faire un test has registred
        require(msg.value > 0, "Value must be more than 0");
        bool inRange = cLD._checkTierBalance(_id, _tierID.current());
        if (!inRange) {
            _setTierID();
        }
        bool success = cLD._checkAmount(
            _id,
            msg.sender,
            _tierID.current(),
            msg.value
        );
        require(success, "Error on _checkAmount");
        success = cLI._investOnLaunchpad(
            _id,
            _tierID.current(),
            msg.sender,
            msg.value
        );
        require(success, "Error on invest on launchpad");

        cLD._addAmountRaised(_id, _tierID.current(), msg.value);

        inRange = cLD._checkTierBalance(_id, _tierID.current());
        if (!inRange) {
            _setTierID();
        }
    }
}
