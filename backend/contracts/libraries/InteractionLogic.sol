// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

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
}
