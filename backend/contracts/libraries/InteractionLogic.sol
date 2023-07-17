// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;
import {DataTypes} from "./DataTypes.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

library InteractionLogic {
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
        address _ownerOf,
        DataTypes.LaunchpadData calldata _data
    ) internal view returns (bool) {
        IERC20 token = IERC20(_data.tokenAddress);
        require(token.balanceOf(_ownerOf) > 0, "Owner has no token");
        require(_data.numberOfTier >= 0, "Must have at least on tier");
        // require(_data.pubURI != "", "Must have pubURI");
        require(_data.minCap > 0, "Min cap must be greater than 0");
        require(_data.maxCap > 0, "Max cap must be greater than 0");
        require(
            _data.minCap <= _data.maxCap,
            "Min cap must be less than max cap"
        );
        require(_data.minInvest > 0, "Min invest must be greater than 0");
        require(
            _data.saleStart > block.timestamp + 10000,
            "Sale start must be greater than now + 10 sec"
        );
        require(
            _data.saleEnd > block.timestamp + 100000,
            "Sale end must be greater than now"
        );
        require(
            _data.saleStart < _data.saleEnd,
            "Sale start must be less than sale end"
        );
        require(_data.lockedTime > 0, "Locked time must be greater than 0");
        require(_data.totalUser == 0, "Total user must be 0 at first");

        return true;
    }

    function _checkLaunchpadTierData(
        DataTypes.TierData memory _data,
        uint _id,
        uint _maxTiers
    ) internal pure returns (bool) {
        require(_id < _maxTiers, "Tier id must be less than max tiers");
        require(_data.minTierCap > 0, "Min tier cap must be > 0");
        require(_data.maxTierCap > 0, "Max tier cap must be > 0");
        require(
            _data.minTierCap <= _data.maxTierCap,
            "Mismatches tier cap values"
        );
        require(_data.amountRaised == 0, "Amount raised must be 0 at first");
        require(_data.tokenPrice > 0, "Token must be have a price");
        require(_data.users == 0, "Users must be 0 at first");
        return true;
    }
}
