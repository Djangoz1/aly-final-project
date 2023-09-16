// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

/**
 * @notice This contract stored datas.
 * CV can be :
 * - Followed
 * - Unfollowed
 */
interface ICVsDatasHub {
    function follow(uint _cvSender, uint _cvFollowed) external;

    function unfollow(uint _cvSender, uint _cvFollowed) external;

    function followerOf(uint _cvID, uint _index) external view returns (uint);

    function followedOf(uint _cvID, uint _index) external view returns (uint);

    function isFollow(uint _cv, uint _id) external view returns (bool);

    function lengthOfFollower(uint _cvID) external view returns (uint);

    function lengthOfFollowed(uint _cvID) external view returns (uint);
}
