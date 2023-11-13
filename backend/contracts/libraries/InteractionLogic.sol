// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;
import {DataTypes} from "./DataTypes.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

library InteractionLogic {
    using SafeMath for uint256;

    function _followMission(
        address _toFollow,
        address[] memory _followMissions
    ) internal returns (address) {
        require(_toFollow != address(0), "Should follow value address");
        bool allowedToFollow = true;
        for (uint256 i = 0; i < _followMissions.length; ) {
            if (_followMissions[i] == _toFollow) {
                allowedToFollow = false;
            }
            unchecked {
                ++i;
            }
        }
        require(allowedToFollow, "Already followed");
        // ! IMission(_toFollow).incrementFollower();
        return _toFollow;
    }

    function _checkLaunchpadData(
        DataTypes.LaunchpadData memory _data
    ) internal view returns (bool) {
        require(
            _data.saleStart >= block.timestamp, // ! Test value ! Increase on prod
            "Invalid sale start"
        );
        // require(
        //     _data.tokenAddress != address(0),
        //     "Must assign a token address"
        // );
        // IERC20 token = IERC20(_data.tokenAddress);
        // require(token.balanceOf(_ownerOf) > 0, "0 tokens balance");
        // require(_data.numberOfTier >= 0, "Must have at least one tier");
        // require(_data.pubURI != "", "Must have pubURI");
        require(_data.minCap > 0, "Min cap must be greater than 0");
        require(_data.maxCap > 0, "Max cap must be greater than 0");
        require(
            _data.minCap <= _data.maxCap,
            "Missmatch capitalization values"
        );
        require(_data.minInvest > 0, "Min invest must be greater than 0");
        require(_data.maxInvest <= _data.maxCap, "Missmatch invest value");
        require(_data.saleEnd > block.timestamp + 1000, "Invalid sale end"); // ! Test value ! Increase on prod
        require(_data.saleStart < _data.saleEnd, "Missmatch sale time");
        // require(_data.lockedTime > 0, "Locked time must be greater than 0");
        require(_data.totalUser == 0, "Total user must be 0 at first");

        return true;
    }

    // function _checkLaunchpadTierData(
    //     DataTypes.TierData memory _data,
    //     uint _id,
    //     uint _maxTiers
    // ) internal pure returns (bool) {
    //     require(_id < _maxTiers, "Too many tiers datas");
    //     require(_data.minTierCap > 0, "Min tier cap must be > 0");
    //     require(_data.maxTierCap > 0, "Max tier cap must be > 0");
    //     require(
    //         _data.minTierCap <= _data.maxTierCap,
    //         "Mismatches tier cap values"
    //     );
    //     require(_data.amountRaised == 0, "Amount raised must be 0 at first");
    //     require(_data.tokenPrice > 0, "Token must be have a price");
    //     require(_data.users == 0, "Users must be 0 at first");
    //     return true;
    // }
}
