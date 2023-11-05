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

    mapping(uint => DataTypes.PubData) pubsToDatas;
    mapping(uint => DataTypes.PubPayableData) internal pubsPayableToDatas;

    /**
     * pubID > cvID > bool
     */
    mapping(uint => mapping(uint => bool)) internal listsOfAllowedAccounts;

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
            msg.sender == _iAS.pubsHub() ||
                msg.sender == _iAS.apiPost() ||
                msg.sender == _iAS.apiPostPayable() ||
                msg.sender == _iAS.apiGet(),
            "Must be call by proxy bindings"
        );
        _;
    }

    modifier onlyExist(uint _pubID) {
        require(
            _pubID <= Bindings.tokensLength(_iAS.pubsHub()),
            "PubID not found"
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
        pubsToDatas[_pubID].likes++;
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
        require(prevDatas.pubID == _pubID, "Missmatch pubID");
        require(_likeID == prevDatas.id, "Missmatch likeID");
        DataTypes.LikeData memory cleanDatas;
        delete pubsToLikes[prevDatas.pubID][prevDatas.indexedAt];
        likesToDatas[_likeID] = cleanDatas;
        delete cvsToLikes[_cvID][_pubID];
        pubsToDatas[_pubID].likes--;

        _burn(_likeID);
    }

    function datasOfPayablePub(
        uint _pubID
    )
        external
        view
        onlyProxy
        onlyExist(_pubID)
        returns (DataTypes.PubPayableData memory)
    {
        return pubsPayableToDatas[_pubID];
    }

    function isAllowed(
        uint _cvID,
        uint _pubID
    ) external view onlyExist(_pubID) returns (bool) {
        return listsOfAllowedAccounts[_pubID][_cvID];
    }

    function mintPayablePub(
        uint _pubID,
        uint _amount,
        string calldata _tokenURI
    ) external onlyProxy returns (bool) {
        DataTypes.PubPayableData memory newDatas;
        newDatas.tokenURI = _tokenURI;
        newDatas.amount = _amount;
        pubsPayableToDatas[_pubID] = newDatas;
        pubsToDatas[_pubID].isPayable = true;
        return true;
    }

    function buyPub(
        uint _cvID,
        uint _pubID
    ) external onlyExist(_pubID) onlyProxy returns (bool) {
        require(
            pubsPayableToDatas[_pubID].amount > 0 &&
                listsOfAllowedAccounts[_pubID][_cvID] == false,
            "Error buy pub"
        );
        listsOfAllowedAccounts[_pubID][_cvID] = true;
        pubsPayableToDatas[_pubID].viewers++;
        return true;
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
        return pubsToLikes[_pubID];
    }

    function dataOf(
        uint _likeID
    ) external view returns (DataTypes.LikeData memory) {
        require(_likeID <= _likeIDs.current(), "Like ID not exist");
        require(likesToDatas[_likeID].id != 0, "Not liked");
        return likesToDatas[_likeID];
    }

    function dataOfPub(
        uint _pubID
    )
        external
        view
        ifTokenExist((_pubID), _iAS.pubsHub())
        returns (DataTypes.PubData memory)
    {
        return pubsToDatas[_pubID];
    }

    function addPubMission(
        uint _newPubID,
        uint _missionID,
        string memory _tokenURI
    ) external {
        require(_newPubID != 0, "Error create pub");
        missionsToPubs[_missionID].push(_newPubID);
        pubsToDatas[_newPubID].missionID = _missionID;
    }

    function addPubAnswer(
        uint _newPubID,
        uint _pubID,
        string memory _tokenURI
    ) external {
        require(_newPubID != 0, "Error create pub");
        pubsToAnswers[_pubID].push(_newPubID);
        pubsToDatas[_pubID].answers++;
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
