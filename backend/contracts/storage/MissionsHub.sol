// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

import {IAccessControl} from "../interfaces/IAccessControl.sol";

contract MissionsHub is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIDs;

    IAccessControl accessControl;

    mapping(address => uint[]) indexers;

    /**
     * @notice each mission return featuresIndexer
     */
    mapping(uint => uint[]) featuresIndexer;

    modifier onlyProxy() {
        require(
            msg.sender == address(accessControl),
            "Must call function with proxy bindings"
        );
        _;
    }

    modifier onlyFeaturesHub() {
        require(
            msg.sender == accessControl.getFeaturesHub(),
            "Only featuresHub can call this function"
        );
        _;
    }

    // *::::::::::::: ----------- ::::::::::::* //
    // *::::::::::::: CONSTRUCTOR ::::::::::::* //
    // *::::::::::::: ----------- ::::::::::::* //

    constructor(address _accessControl) ERC721("Mission", "WM") {
        accessControl = IAccessControl(_accessControl);
        accessControl.setMissionsHub(address(this));
    }

    function checkRegistred(uint _id) external view {
        require(_id <= _tokenIDs.current(), "Id out of range");
        require(ownerOf(_id) != address(0), "Mission not found");
    }

    // *::::::::::::: ------ ::::::::::::* //
    // *::::::::::::: SETTER ::::::::::::* //
    // *::::::::::::: ------ ::::::::::::* //

    function createMission(
        address _cv,
        string calldata _tokenURI
    ) external onlyProxy returns (uint) {
        _tokenIDs.increment();
        uint newProposalID = _tokenIDs.current();
        indexers[_cv].push(newProposalID);
        _mint(_cv, newProposalID);
        _setTokenURI(newProposalID, _tokenURI);
        return newProposalID;
    }

    function setFeatureMission(
        address _cv,
        uint _missionID,
        uint _featureID
    ) external onlyFeaturesHub {
        require(ownerOf(_missionID) == _cv, "Not the owner of mission");
        featuresIndexer[_missionID].push(_featureID);
    }

    // *::::::::::::: ------ ::::::::::::* //
    // *::::::::::::: GETTER ::::::::::::* //
    // *::::::::::::: ------ ::::::::::::* //

    /**
     * @param _cv is cv address
     * @return [] of missionIds
     */

    function getIndexer(address _cv) external view returns (uint[] memory) {
        require(indexers[_cv].length > 0, "No missions index found");
        return indexers[_cv];
    }

    function getTokensLength() external view returns (uint256) {
        return _tokenIDs.current();
    }

    function getFeaturesIndexer(
        uint _missionID
    ) external view returns (uint[] memory) {
        return featuresIndexer[_missionID];
    }
}
