// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

import {DataTypes} from "../libraries/DataTypes.sol";

import {AddressHub} from "../storage/AddressHub.sol";

import {CollectLikePub} from "../collect/CollectLikePub.sol";
import {CollectPubs} from "../collect/CollectPubs.sol";
import {ICVHub} from "../interfaces/ICVHub.sol";

contract PubsHub is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIDs;

    /**
     * @dev storage indexer publications
     * @notice key uint cvID is for cv publisher
     * @notice array of index publications for each publisher
     */
    mapping(uint => uint[]) indexers;

    AddressHub addressHub;
    CollectLikePub CLP;
    address addrCollectPubs;

    modifier onlyProxy() {
        require(
            msg.sender == address(addressHub.accessControl()),
            "Must call function with proxy bindings"
        );
        _;
    }

    constructor(address _addressHub) ERC721("Pub", "WPB") {
        addressHub = AddressHub(_addressHub);
        addressHub.setPubHub(address(this));
        CLP = new CollectLikePub(address(addressHub));
        CollectPubs CP = new CollectPubs(address(addressHub));
        addrCollectPubs = address(CP);
    }

    function getTokensLength() external view returns (uint) {
        return _tokenIDs.current();
    }

    function getCollectLikePub() external view returns (address) {
        return address(CLP);
    }

    function getCollectPubs() external view returns (address) {
        return addrCollectPubs;
    }

    /**
     * @param _cvID address is address of cv publisher
     * @return uint [] ids of publication
     */
    function getIndexer(uint _cvID) external view returns (uint[] memory) {
        return indexers[_cvID];
    }

    function mint(
        uint _cvID,
        string calldata _tokenURI
    ) external onlyProxy returns (uint) {
        ICVHub iCVH = ICVHub(addressHub.cvHub());
        address cvAddr = iCVH.ownerOf(_cvID);

        _tokenIDs.increment();
        uint newPubID = _tokenIDs.current();
        indexers[_cvID].push(newPubID);
        _mint(cvAddr, newPubID);
        _setTokenURI(newPubID, _tokenURI);
        return newPubID;
    }

    function likePub(uint _id) external {
        CLP.mint(msg.sender, _id);
    }

    function unlikePub(uint _id) external {
        CLP.burn(msg.sender, _id);
    }
}
