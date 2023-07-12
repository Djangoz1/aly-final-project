// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

import {DataTypes} from "../libraries/DataTypes.sol";
import {Bindings} from "../libraries/Bindings.sol";

import {IAccessControl} from "../interfaces/IAccessControl.sol";

contract PubsHub is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIDs;

    // !! todo
    // !! todo
    // !! todo
    // !! todo
    // !! todo
    // !! todo
    /// @todo faire les test avec le standard erc721
    // !! todo
    // !! todo
    // !! todo
    // !! todo
    /**
     * @dev storage indexer publications
     * @notice key address is for cv publisher
     * @notice array of index publications for each publisher
     */
    mapping(address => uint[]) indexers;

    IAccessControl accessControl;

    modifier onlyProxy() {
        require(
            msg.sender == address(accessControl),
            "Must call function with proxy bindings"
        );
        _;
    }

    constructor(address _accessControl) ERC721("Pub", "WPB") {
        accessControl = IAccessControl(_accessControl);
        accessControl.setPubHub(address(this));
    }

    function getTokensLength() external view returns (uint) {
        return _tokenIDs.current();
    }

    /**
     * @param _cv address is address of cv publisher
     * @return uint [] ids of publication
     */
    function getIndexer(address _cv) external view returns (uint[] memory) {
        return indexers[_cv];
    }

    function postPub(
        address _cv,
        string calldata _tokenURI
    ) external onlyProxy returns (uint) {
        _tokenIDs.increment();
        uint newPubID = _tokenIDs.current();
        indexers[_cv].push(newPubID);
        _mint(_cv, newPubID);
        _setTokenURI(newPubID, _tokenURI);
        return newPubID;
    }
}
