// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import {IAddressSystem} from "../interfaces/system/IAddressSystem.sol";
import {ICVsHub} from "../interfaces/cv/ICVsHub.sol";
import {DataTypes} from "../libraries/DataTypes.sol";

contract CVsDatasHub is Ownable {
    using Counters for Counters.Counter;

    /**
     * @dev storage indexer follow for each cv
     * @notice mapping for followers
     * @notice address param is for cv address
     * @notice return array of ID follow for each cv
     */

    mapping(uint => uint[]) indexers;

    /**
     * @dev storage indexer follow for each pub
     * @notice mapping for followed
     * @notice address param is for cv id
     * @notice return uint of index on indexers for each cv
     */

    mapping(uint => DataTypes.FollowData[]) indexersFollowed;

    mapping(uint => mapping(uint => uint)) followed;

    IAddressSystem private _iAS;

    ICVsHub private _iCVH;

    modifier onlyProxy() {
        require(
            msg.sender == address(_iAS.apiPost()),
            "Must call function with hub bindings"
        );
        _;
    }

    constructor(address _addressSystem) {
        _iAS = IAddressSystem(_addressSystem);
        require(_iAS.cvsHub() != address(0), "Deployed CVsHub first");
        _iCVH = ICVsHub(_iAS.cvsHub());
        _iAS.setCVsDatasHub();
        require(
            _iAS.cvsDatasHub() == address(this),
            "CVsDatasHub : Error deployment"
        );
    }

    function follow(uint _cvSender, uint _cvFollowed) external onlyProxy {
        require(!_isFollow(_cvSender, _cvFollowed), "Already followed");
        indexers[_cvFollowed].push(_cvSender);
        DataTypes.FollowData memory followData;
        followData.cvID = _cvFollowed;
        followData.indexedAt = indexers[_cvFollowed].length;
        indexersFollowed[_cvSender].push(followData);
        followed[_cvSender][_cvFollowed] = indexersFollowed[_cvSender].length;
    }

    function unfollow(uint _cvSender, uint _cvFollowed) external onlyProxy {
        require(_isFollow(_cvSender, _cvFollowed), "Not followed");
        uint index = followed[_cvSender][_cvFollowed] - 1;
        uint index1 = indexersFollowed[_cvSender][index].indexedAt - 1;
        delete indexers[_cvFollowed][index1];
        delete indexersFollowed[_cvSender][index];
        followed[_cvSender][_cvFollowed] = 0;
    }

    function followerOf(uint _cvID, uint _index) external view returns (uint) {
        require(_iCVH.ownerOf(_cvID) != address(0), "CV not exist");
        require(_index < indexers[_cvID].length, "Index out of range");
        return indexers[_cvID][_index];
    }

    function followedOf(uint _cvID, uint _index) external view returns (uint) {
        require(_iCVH.ownerOf(_cvID) != address(0), "CV not found");
        require(_index < indexersFollowed[_cvID].length, "Index out of range");
        return indexersFollowed[_cvID][_index].cvID;
    }

    function isFollow(uint _cv, uint _id) external view returns (bool) {
        return _isFollow(_cv, _id);
    }

    function _isFollow(
        uint _cvFollower,
        uint _cvFollowed
    ) internal view returns (bool) {
        return followed[_cvFollower][_cvFollowed] > 0;
    }

    function lengthOfFollower(uint _cvID) external view returns (uint) {
        uint i = 0;
        for (uint256 index = 0; index < indexers[_cvID].length; index++) {
            if (indexers[_cvID][index] != 0) {
                i++;
            }
        }
        return i;
    }

    function lengthOfFollowed(uint _cvID) external view returns (uint) {
        uint i = 0;
        for (
            uint256 index = 0;
            index < indexersFollowed[_cvID].length;
            index++
        ) {
            if (indexersFollowed[_cvID][index].cvID != 0) {
                i++;
            }
        }
        return i;
    }
}