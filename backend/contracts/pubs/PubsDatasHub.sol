// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

import {DataTypes} from "../libraries/DataTypes.sol";
import {Bindings} from "../libraries/Bindings.sol";

import {IAddressSystem} from "../interfaces/system/IAddressSystem.sol";
import {IPubsHub} from "../interfaces/pubs/IPubsHub.sol";

contract PubsDatasHub is ERC721, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _likeIDs;

    mapping(uint => uint[]) internal missionsToPubs;
    mapping(uint => uint[]) internal pubsToAnswers;
    /**
     * @dev storage indexer like for each pub
     * @notice uint param is for pub ID
     * @notice return array of ID follow for each pub
     */
    mapping(uint => uint[]) internal pubsToLikes;

    mapping(uint => DataTypes.LikeData) internal likesToDatas;

    /**
     * @dev storage indexer like for each CV
     * @notice uint param is for cv id
     * @notice return likeData for each pubID
     */

    mapping(uint => mapping(uint => uint)) internal cvsToLikes;

    modifier onlyProxy() {
        require(
            msg.sender == _iAS.pubsHub() || msg.sender == _iAS.apiPost(),
            "Must be call by proxy bindings"
        );
        _;
    }

    IAddressSystem internal _iAS;
    IPubsHub internal _iPH;

    modifier ifTokenExist(uint _id, address _contract) {
        require(
            Bindings.tokensLength(_contract) >= _id,
            "PubsDatasHub: Invalid ID"
        );
        _;
    }

    constructor(address _addressSystem) ERC721("LikePub", "WLP") {
        _iAS = IAddressSystem(_addressSystem);
        _iAS.setPubsDatasHub();
        require(
            _iAS.pubsDatasHub() == address(this),
            "CollectLikePub: Error deployment"
        );
    }

    function like(uint _cvID, uint _pubID) external onlyProxy {
        address _from = Bindings.ownerOf(_cvID, _iAS.cvsHub());

        require(cvsToLikes[_cvID][_pubID] == 0, "CV already like this pub");
        _likeIDs.increment();
        uint newLikeID = _likeIDs.current();
        DataTypes.LikeData memory newDatas;
        _mint(_from, newLikeID);

        newDatas.indexedAt = pubsToLikes[_pubID].length;
        pubsToLikes[_pubID].push(newLikeID);
        newDatas.pubID = _pubID;
        newDatas.id = newLikeID;
        cvsToLikes[_cvID][_pubID] = newLikeID;
        likesToDatas[newLikeID] = newDatas;
    }

    function unlike(uint _cvID, uint _pubID) external onlyProxy {
                address _from = Bindings.ownerOf(_cvID, _iAS.cvsHub());

        uint _likeID = cvsToLikes[_cvID][_pubID];
        require(
            _likeID <= _likeIDs.current() && _likeID != 0,
            "Like ID not exist"
        );
        require(likesToDatas[_likeID].id == _likeID, "Not liked");
        require(ownerOf(_likeID) == _from, "Not the owner");
        DataTypes.LikeData memory prevDatas = likesToDatas[_likeID];
        require(prevDatas.pubID == _pubID, 'Missmatch pubID');
        require(_likeID == prevDatas.id, 'Missmatch likeID');
        DataTypes.LikeData memory cleanDatas;
        delete pubsToLikes[prevDatas.pubID][prevDatas.indexedAt];
        likesToDatas[_likeID] = cleanDatas;
        delete cvsToLikes[_cvID][_pubID];
        _burn(_likeID);
    }

    /**
     * @return Total likes
     */
    function tokensLength() external view returns (uint) {
        return _likeIDs.current();
    }

    function indexerOf(
        uint _pubID
    )
        external
        view
        ifTokenExist(_pubID, _iAS.pubsHub())
        returns (uint[] memory)
    {
        require(pubsToLikes[_pubID].length > 0, "Likes not exist");
        return pubsToLikes[_pubID];
    }

    function dataOf(
        uint _likeID
    ) external view returns (DataTypes.LikeData memory) {
        require(_likeID <= _likeIDs.current(), "Like ID not exist");
        require(likesToDatas[_likeID].id != 0, "Not liked");
        return likesToDatas[_likeID];
    }

    function addPubMission(
        uint _newPubID,
        uint _missionID,
        string memory _tokenURI
    ) external {
        require(_newPubID != 0, "Error create pub");
        missionsToPubs[_missionID].push(_newPubID);
    }

    function addPubAnswer(
        uint _newPubID,
        uint _pubID,
        string memory _tokenURI
    ) external {
        require(_newPubID != 0, "Error create pub");
        pubsToAnswers[_pubID].push(_newPubID);
    }

    function answersOfPub(
        uint _pubID
    )
        external
        view
        ifTokenExist(_pubID, _iAS.pubsHub())
        returns (uint[] memory)
    {
        return pubsToAnswers[_pubID];
    }

    function pubsOfMission(
        uint _missionID
    )
        external
        view
        ifTokenExist(_missionID, _iAS.missionsHub())
        returns (uint[] memory)
    {
       
        return missionsToPubs[_missionID];
    }

    function _cvOf(address _for) internal view returns (uint) {
        return Bindings.cvOf(_for, _iAS.cvsHub());
    }
}
