// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

import {DataTypes} from "../libraries/DataTypes.sol";
import {Bindings} from "../libraries/Bindings.sol";
import {IAccessControl} from "../interfaces/IAccessControl.sol";

contract WorkProposalHub is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIDs;

    mapping(address => uint[]) indexer;

    /// @notice id work proposal is linked to feature
    mapping(uint => uint) featuresIDs;

    IAccessControl accessControl;

    modifier onlyProxy() {
        require(
            msg.sender == address(accessControl),
            "Must call function with proxy bindings"
        );
        _;
    }

    constructor(address _accessControl) ERC721("WorkProposal", "WP") {
        accessControl = IAccessControl(_accessControl);
        accessControl.setWorkerProposalHub(address(this));
    }


    function getTokenLength () public view returns (uint){
        return _tokenIDs.current();
    }


    function postWorkerProposal(
        address _cv,
        string calldata _tokenURI,
        uint _featureID
    ) external onlyProxy returns (uint) {
        _tokenIDs.increment();
        uint newProposalID = _tokenIDs.current();
        indexer[_cv].push(newProposalID);
        _mint(_cv, newProposalID);
        _setTokenURI(newProposalID, _tokenURI);
        featuresIDs[newProposalID] = _featureID;
        return newProposalID;
    }

    function getIndexer(address _cv) external view returns(uint[] memory){
        require(indexer[_cv].length > 0, "No work proposal found");
        return indexer[_cv];
    }

    function getFeatureOfWorkProposal(uint _idProposal) external view returns(uint){
        return featuresIDs[_idProposal];
    }
}
