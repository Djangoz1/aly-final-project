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
    IAddressSystem internal _iAS;
    IPubsHub internal _iPH;
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

    function _cvOf(address _for) internal view returns (uint) {
        return Bindings.cvOf(_for, _iAS.cvsHub());
    }
}
