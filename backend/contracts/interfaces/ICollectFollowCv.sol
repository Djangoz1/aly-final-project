// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

import {AddressHub} from "../storage/AddressHub.sol";
import {ICVHub} from "../interfaces/ICVHub.sol";
import {DataTypes} from "../libraries/DataTypes.sol";

interface ICollectFollowCv {
    function follow(uint _cvSender, uint _cvFollowed) external;

    function unfollow(uint _cvSender, uint _cvFollowed) external;

    function getFollower(uint _cvID, uint _index) external view returns (uint);

    function getFollowed(uint _cvID, uint _index) external view returns (uint);

    function isFollow(uint _cv, uint _id) external view returns (bool);

    function getFollowerLength(uint _cvID) external view returns (uint);

    function getFollowedLength(uint _cvID) external view returns (uint);
}
