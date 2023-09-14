// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

import {DataTypes} from "../libraries/DataTypes.sol";
import {Bindings} from "../libraries/Bindings.sol";
import {AddressHub} from "../storage/AddressHub.sol";
import {IPubsHub} from "../interfaces/IPubsHub.sol";
import {CVHub} from "../storage/CVHub.sol";

contract CollectLikePub is ERC721 {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIDs;

    /**
     * @dev storage indexer like for each pub
     * @notice uint param is for pub ID
     * @notice return array of ID follow for each pub
     */
    mapping(uint => uint[]) internal indexers;

    mapping(uint => DataTypes.LikeData) internal datas;

    /**
     * @dev storage indexer like for each CV
     * @notice uint param is for cv id
     * @notice return likeData for each pubID
     */

    mapping(uint => mapping(uint => uint)) internal indexersCV;
    // mapping(uint => mapping(uint => uint)) indexersCV;

    AddressHub internal addressHub;
    IPubsHub internal iPH;

    modifier onlyProxy() {
        require(
            msg.sender == address(iPH),
            "Must call function with pubsHub bindings"
        );
        _;
    }

    constructor(address _addressHub) ERC721("LikePub", "WLP") {
        addressHub = AddressHub(_addressHub);
        iPH = IPubsHub(msg.sender);
    }

    function getPubsHub() external view returns (address) {
        return address(iPH);
    }

    function getTokensLength() external view returns (uint) {
        return _tokenIDs.current();
    }

    function getIndexer(uint _pubID) external view returns (uint[] memory) {
        require(indexers[_pubID].length > 0, "Likes not exist");

        return indexers[_pubID];
    }

    function getData(
        uint _likeID
    ) external view returns (DataTypes.LikeData memory) {
        require(_likeID <= _tokenIDs.current(), "Like ID not exist");

        require(datas[_likeID].id != 0, "Not liked");
        return datas[_likeID];
    }

    function mint(address _from, uint _pubID) external onlyProxy {
        uint cvID = _getCV(_from);

        require(
            _pubID <= Bindings.tokensLength(addressHub.pubsHub()),
            "Pub ID not exist"
        );

        _tokenIDs.increment();
        uint newLikeID = _tokenIDs.current();
        require(indexersCV[cvID][_pubID] == 0, "CV already like this pub");
        DataTypes.LikeData memory newDatas;
        _mint(_from, newLikeID);

        indexers[_pubID].push(newLikeID);
        newDatas.indexedAt = indexers[_pubID].length - 1;
        newDatas.pubID = _pubID;
        newDatas.id = newLikeID;
        indexersCV[cvID][_pubID] = newLikeID;
        datas[newLikeID] = newDatas;
    }

    function burn(address _owner, uint _pubID) external onlyProxy {
        uint cvOwnerID = _getCV(_owner);
        uint _likeID = indexersCV[cvOwnerID][_pubID];
        require(
            _likeID <= _tokenIDs.current() && _likeID != 0,
            "Like ID not exist"
        );
        require(datas[_likeID].id == _likeID, "Not liked");
        require(ownerOf(_likeID) == _owner, "Not the owner");

        DataTypes.LikeData memory prevDatas = datas[_likeID];
        DataTypes.LikeData memory cleanDatas;
        delete indexers[prevDatas.pubID][prevDatas.indexedAt];
        datas[_likeID] = cleanDatas;
        delete indexersCV[cvOwnerID][_pubID];
        _burn(_likeID);
    }

    function _getCV(address _for) internal view returns (uint) {
        return Bindings.getCV(_for, addressHub.cvHub());
    }
}
