// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

import {DataTypes} from "../libraries/DataTypes.sol";
import {IAddressSystem} from "../interfaces/system/IAddressSystem.sol";
import {ICVsHub} from "../interfaces/cv/ICVsHub.sol";

contract WorkProposalHub is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIDs;

    /**
     * @dev storage indexer work proposal for each CV
     * @notice key uint is for CV ID
     * @notice return array of ID work proposal for each CV
     */
    mapping(uint => uint[]) indexer;

    /// @notice id work proposal is linked to feature
    mapping(uint => uint) featuresIDs;

    IAddressSystem private _iAS;

    modifier onlyProxy() {
        require(
            msg.sender == address(_iAS.accessControl()),
            "Must call function with proxy bindings"
        );
        _;
    }

    constructor(address _addressSystem) ERC721("WorkProposal", "WP") {
        _iAS = IAddressSystem(_addressSystem);
        _iAS.setWorkProposalHub();
        require(
            _iAS.workProposalHub() == address(this),
            "WorkProposalHub: Error deployment"
        );
    }

    function tokensLength() public view returns (uint) {
        return _tokenIDs.current();
    }

    function postWorkerProposal(
        address _owner,
        string calldata _tokenURI,
        uint _featureID
    ) external onlyProxy returns (uint) {
        ICVsHub iCVH = ICVsHub(_iAS.cvsHub());
        _tokenIDs.increment();
        uint newProposalID = _tokenIDs.current();
        indexer[iCVH.cvOf(_owner)].push(newProposalID);
        _mint(_owner, newProposalID);
        _setTokenURI(newProposalID, _tokenURI);
        featuresIDs[newProposalID] = _featureID;
        return newProposalID;
    }

    function indexerOf(uint _cvID) external view returns (uint[] memory) {
        require(indexer[_cvID].length > 0, "No work proposal found");
        return indexer[_cvID];
    }

    function getFeatureOfWorkProposal(
        uint _idProposal
    ) external view returns (uint) {
        return featuresIDs[_idProposal];
    }
}
