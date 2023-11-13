// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
// import "@openzeppelin/contracts/security/Pausable.sol";
// import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

import "hardhat/console.sol";

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

    uint public id;

    // IERC20 private iERC20;

    DataTypes.LaunchpadStatus public status;

    modifier onlyStatus(DataTypes.LaunchpadStatus _status) {
        require(status == _status, "Wrong status expected");
        _;
    }

    modifier onlyProxy() {
        require(
            msg.sender == address(_iAS.apiPostPayable()) ||
                msg.sender == address(_iAS.apiPost()) ||
                msg.sender == _iAS.launchpadsInvestorsHub(),
            "Must call function with proxy bindings"
        );
        _;
    }

    modifier onlyProcess() {
        require(block.timestamp > _datas().saleStart, "Sale not started");
        require(block.timestamp < _datas().saleEnd, "Sale ended");
        _;
    }

    constructor(
        address _addressSystem,
        address _owner,
        uint256 id_ // address _tokenAddress
    ) {
        transferOwnership(_owner);
        _iAS = IAddressSystem(_addressSystem);
        require(msg.sender == _iAS.launchpadsHub());

        // iERC20 = IERC20(_tokenAddress);
        id = id_;
        require(
            _iAS.launchpadsDatasHub() != address(0) &&
                _iAS.launchpadsInvestorsHub() != address(0),
            "Launchpad : Failure constructor"
        );

        cLD = ILaunchpadsDatasHub(_iAS.launchpadsDatasHub());
        cLI = ILaunchpadsInvestorsHub(_iAS.launchpadsInvestorsHub());
        status = DataTypes.LaunchpadStatus.Init;
    }

    // /**
    //  * @notice check if contract have allowance to transfered that amount of token
    //  * check if owner have enough funds
    //  * it's call by collectLaunchpadInvestor after buyToken
    //  * if not, the protocol paused automatically this contract
    //  * @param _tokens is number of token that sender buy
    //  */
    // function transferIfAllow(uint _tokens) external onlyProxy returns (bool) {
    //     uint valueAllowed = iERC20.allowance(owner(), address(this));

    //     require(
    //         iERC20.balanceOf(owner()) >= valueAllowed &&
    //             valueAllowed >= _tokens &&
    //             _tokens > 0 &&
    //             valueAllowed > 0,
    //         "Error value transfer"
    //     );

    //     bool success = iERC20.transferFrom(owner(), address(this), _tokens);
    //     require(success, "Error transfer token");
    //     return true;
    // }

    // *::::::::: ---------------- :::::::::* //
    // *::::::::: STATE MANAGEMENT :::::::::* //
    // *::::::::: ---------------- :::::::::* //

    // function pause() external onlyOwner {
    //     _pause();
    // }

    // function unpause() external onlyOwner {
    //     _unpause();
    // }

    // /**
    //  * @notice must be call after ERC20.approve(address(this) amount)
    //  * @notice protocol take 1% royalties
    //  * @param _tokens must be equal of the allowance of contract for sender address
    //  */
    // function lockTokens(
    //     uint _cvID,
    //     uint _tokens
    // ) external onlyStatus(DataTypes.LaunchpadStatus.Waiting) onlyProxy {
    //     address sender = Bindings.ownerOf(_cvID, _iAS.cvsHub());

    //     require(sender == owner(), "Ownable: caller is not the owner");
    //     require(
    //         iERC20.balanceOf(sender) >= _tokens &&
    //             iERC20.allowance(sender, address(this)) == _tokens,
    //         "Invalid funds tokens"
    //     );
    //     uint royalties = _tokens.div(100);
    //     bool success = iERC20.transferFrom(
    //         sender,
    //         address(ILaunchpadHub(_iAS.launchpadsHub()).owner()),
    //         royalties
    //     );
    //     require(success, "Royalties can't be transferred");
    //     status = DataTypes.LaunchpadStatus.Init;
    // }

    function getCurrentTierID() external view returns (uint8) {
        return uint8(_tierID.current());
    }

    function _datas() internal view returns (DataTypes.LaunchpadData memory) {
        return cLD.datasOf(id);
    }

    // function setTierID() external onlyProxy {
    //     _setTierID();
    // }

    // function _setTierID() private onlyStatus(DataTypes.LaunchpadStatus.Init) {
    //     DataTypes.LaunchpadData memory datas_ = _datas();
    //     require(block.timestamp > datas_.saleStart, "Sale not started");
    //     DataTypes.TierData memory _tierData = cLD.tierOf(id, _tierID.current());
    //     require(
    //         _tierID.current() != datas_.numberOfTier,
    //         "Tier ID out of range"
    //     );
    //     uint tierID_ = _tierID.current().add(1);
    //     require(
    //         _tierData.minTierCap <= _tierData.amountRaised ||
    //             datas_.saleEnd < block.timestamp,
    //         "Must have minimum cap to set tierID"
    //     );

    //     if (
    //         (tierID_ == datas_.numberOfTier &&
    //             _tierData.amountRaised >= _tierData.minTierCap) ||
    //         datas_.saleEnd < block.timestamp
    //     ) {
    //         status = DataTypes.LaunchpadStatus.Closed;
    //         return;
    //     }
    //     _tierID.increment();
    //     _tierData = cLD.tierOf(id, _tierID.current());

    //     if (
    //         _tierID.current() != datas_.numberOfTier - 1 &&
    //         _tierData.maxTierCap == _tierData.amountRaised &&
    //         _tierData.minTierCap < _tierData.amountRaised
    //     ) {
    //         _setTierID();
    //     }
    // }

    // *::::::::: ------------- :::::::::* //
    // *::::::::: USER BINDINGS :::::::::* //
    // *::::::::: ------------- :::::::::* //

    function revertIfUncheck(bool success) internal {
        require(success, "Launchpad: Buy token");
    }

    function buyTokens(
        uint _cvSender,
        uint _value
    )
        external
        onlyStatus(DataTypes.LaunchpadStatus.Init)
        onlyProxy
        onlyProcess
        returns (bool)
    {
        // whenNotPaused

        // uint currentTier = _tierID.current();
        DataTypes.LaunchpadData memory _launchpadData = cLD.datasOf(id);
        // DataTypes.TierData memory _tierData = cLD.tierOf(id, _tierID.current());
        // if (_tierData.amountRaised == _tierData.maxTierCap) {
        //     _setTierID();
        // }

        // bool inRange = cLD._checkTierBalance(id, currentTier);
        // if (!inRange) {
        // }

        require(
            _launchpadData.amountRaised.add(_value) <= _launchpadData.maxCap,
            "Value out of range"
        );
        uint256 _balanceOf = ILaunchpadsInvestorsHub(
            _iAS.launchpadsInvestorsHub()
        ).datasOf(id, _cvSender).investedAmount;

        require(
            _launchpadData.minInvest <= _balanceOf.add(_value) &&
                _balanceOf.add(_value) <= _launchpadData.maxInvest,
            "Value not in range invest"
        );

        // revertIfUncheck(
        //     cLD._checkAmount(id, _cvSender, currentTier, _value.sub(rest))
        // );
        revertIfUncheck(cLI._investOnLaunchpad(_cvSender, _value));

        // if (_tierData.amountRaised.add(_value) > _tierData.maxTierCap) {
        //     uint rest = _tierData.amountRaised.add(_value).sub(
        //         _tierData.maxTierCap
        //     );

        //     // require(success, "Error on _checkAmount");
        //     revertIfUncheck(
        //         cLD._checkAmount(id, _cvSender, currentTier + 1, rest)
        //     );

        //     // require(success, "Error on _checkAmount");

        //     // require(success, "Error invest on launchpad");
        //     revertIfUncheck(
        //         cLI._investOnLaunchpad(currentTier + 1, _cvSender, rest)
        //     );

        //     // require(success, "Error invest on launchpad");
        cLD._addAmountRaised(id, _value);
        _launchpadData = cLD.datasOf(id);

        //     cLD._addAmountRaised(id, currentTier + 1, rest);

        //     _setTierID();
        // } else {
        //     revertIfUncheck(
        //         cLD._checkAmount(id, _cvSender, currentTier, _value)
        //     );
        //     revertIfUncheck(
        //         cLI._investOnLaunchpad(currentTier, _cvSender, _value)
        //     );

        //     cLD._addAmountRaised(id, currentTier, _value);

        //     // inRange = cLD._checkTierBalance(id, currentTier);
        //     // if (!inRange) {
        //     // }
        if (_launchpadData.maxCap == _launchpadData.amountRaised) {
            status = DataTypes.LaunchpadStatus.Closed;
        }
        //     _tierData = cLD.tierOf(id, _tierID.current());
        //     if (_tierData.amountRaised == _tierData.maxTierCap) {
        //         _setTierID();
        //     }
        // }
        return true;
    }

    // function withdrawTokens(
    //     uint _cvID
    // ) external onlyStatus(DataTypes.LaunchpadStatus.Closed) onlyProxy {
    //     DataTypes.InvestorData memory investorData = cLI.datasOf(id, _cvID);
    //     DataTypes.LaunchpadData memory datas = _datas();

    //     require(investorData.lockedTokens > 0, "No funds found");

    //     require(
    //         block.timestamp >= datas.lockedTime + datas.saleEnd,
    //         "Wait release period"
    //     ); //! Test value ! Change to days on production
    //     uint tokens = investorData.lockedTokens;
    //     cLI.withdrawTokens(_cvID, id);
    //     bool success = iERC20.transfer(
    //         Bindings.ownerOf(_cvID, _iAS.cvsHub()),
    //         tokens
    //     );
    //     require(success, "Error withdraw");
    // }
}
