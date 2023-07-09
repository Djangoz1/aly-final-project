// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {DataTypes} from "../libraries/DataTypes.sol";
import {Milestone} from "../libraries/Milestone.sol";

interface ICV {
    function getProfile() external  view returns (DataTypes.ProfileData memory);
    function followMission(address _toFollow) external;
    function unfollowMission(address _toUnfollow) external;
    // function postPub(DataTypes.PubData memory _datas) external;
    function setName(string memory _name) external;
    function incrementFeatures(Milestone.Feature memory _newFeature) external;
    function getFeaturesLength() external view returns (uint);
    function getFeature(uint _id) external view returns (Milestone.Feature memory);
}
