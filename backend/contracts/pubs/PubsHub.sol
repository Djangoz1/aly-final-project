// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

import {DataTypes} from "../libraries/DataTypes.sol";
import {Bindings} from "../libraries/Bindings.sol";

import {IAddressSystem} from "../interfaces/system/IAddressSystem.sol";
import {IPubsDatasHub} from "../interfaces/pubs/IPubsDatasHub.sol";
import {ICVsHub} from "../interfaces/cv/ICVsHub.sol";

contract PubsHub is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIDs;

    IAddressSystem _iAS;

    /**
     * @dev storage indexer publications
     * @notice key uint cvID is for cv publisher
     * @notice array of index publications for each publisher
     */
    mapping(uint => uint[]) indexers;
    mapping(uint => uint[]) indexersPayable;

    modifier onlyProxy() {
        require(
            msg.sender == address(_iAS.apiPost()),
            "Must call function with proxy bindings"
        );
        _;
    }

    constructor(address _addressSystem) ERC721("Pub", "WPB") {
        _iAS = IAddressSystem(_addressSystem);
        _iAS.setPubHub();
        require(_iAS.pubsHub() == address(this), "PubsHub: Error deployment");
    }

    function tokensLength() external view returns (uint) {
        return _tokenIDs.current();
    }

    function indexerPayableOf(
        uint _cvID
    ) external view returns (uint[] memory) {
        return indexersPayable[_cvID];
    }

    /**
     * @param _cvID address is address of cv publisher
     * @return uint [] ids of publication
     */
    function indexerOf(uint _cvID) external view returns (uint[] memory) {
        return indexers[_cvID];
    }

    function mint(
        uint _cvID,
        string memory _tokenURI,
        bool _isPayable
    ) external onlyProxy returns (uint) {
        address cvAddr = Bindings.ownerOf(_cvID, _iAS.cvsHub());
        _tokenIDs.increment();

        uint newPubID = _tokenIDs.current();
        indexers[_cvID].push(newPubID);
        if (_isPayable) {
            indexersPayable[_cvID].push(newPubID);
        }
        _mint(cvAddr, newPubID);
        _setTokenURI(newPubID, _tokenURI);
        return newPubID;
    }
}
