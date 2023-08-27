// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

import {AddressHub} from "../storage/AddressHub.sol";
import {ICVHub} from "../interfaces/ICVHub.sol";
import {DataTypes} from "../libraries/DataTypes.sol";

contract MissionsHub is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIDs;

    AddressHub addrHub;

    /**
     * @notice cv ID return array of ID missions
     */
    mapping(uint => uint[]) indexers;

    /**
     * @notice mission ID return data mission
     */
    mapping(uint => DataTypes.MissionData) datas;

    modifier onlyOwnerOf(uint _missionID, address _owner) {
        require(ownerOf(_missionID) == _owner, "Not the owner");
        _;
    }
    modifier onlyProxy() {
        require(
            msg.sender == address(addrHub.accessControl()),
            "Must call function with proxy bindings"
        );
        _;
    }

    modifier onlyFeaturesHub() {
        require(
            msg.sender == addrHub.featuresHub(),
            "Must call function with featuresHub bindings"
        );
        _;
    }

    // *::::::::::::: ----------- ::::::::::::* //
    // *::::::::::::: CONSTRUCTOR ::::::::::::* //
    // *::::::::::::: ----------- ::::::::::::* //

    constructor(address _addressHub) ERC721("Mission", "WM") {
        addrHub = AddressHub(_addressHub);
        addrHub.setMissionsHub(address(this));
    }

    function checkRegistred(uint _id) external view {
        require(_id <= _tokenIDs.current(), "Id out of range");
        require(ownerOf(_id) != address(0), "Mission not found");
    }

    // *::::::::::::: ------ ::::::::::::* //
    // *::::::::::::: SETTER ::::::::::::* //
    // *::::::::::::: ------ ::::::::::::* //

    function mint(
        address _for,
        string calldata _tokenURI
    ) external onlyProxy returns (uint) {
        ICVHub iCVH = ICVHub(addrHub.cvHub());
        _tokenIDs.increment();
        uint newMissionID = _tokenIDs.current();
        DataTypes.MissionData memory newMission;
        newMission.id = newMissionID;
        indexers[iCVH.getCV(_for)].push(newMissionID);
        datas[newMissionID] = newMission;
        _mint(_for, newMissionID);
        _setTokenURI(newMissionID, _tokenURI);
        return newMissionID;
    }

    function addFeature(
        address _owner,
        uint _missionID,
        uint _featureID
    ) external onlyFeaturesHub onlyOwnerOf(_missionID, _owner) {
        require(
            datas[_missionID].status == DataTypes.MissionStatus.Process,
            "Mission closed"
        );
        datas[_missionID].features.push(_featureID);
    }

    function closeMission(
        uint _missionID
    ) external onlyOwnerOf(_missionID, msg.sender) {
        require(
            datas[_missionID].status == DataTypes.MissionStatus.Process,
            "Wrong status"
        );
        datas[_missionID].status = DataTypes.MissionStatus.Close;
    }

    // *::::::::::::: ------ ::::::::::::* //
    // *::::::::::::: GETTER ::::::::::::* //
    // *::::::::::::: ------ ::::::::::::* //

    /**
     * @param _cvID is cv ID
     * @return [] of missionIds
     */

    function getIndexer(uint _cvID) external view returns (uint[] memory) {
        require(indexers[_cvID].length > 0, "No missions index found");
        return indexers[_cvID];
    }

    function getData(
        uint _missionID
    ) external view returns (DataTypes.MissionData memory) {
        require(_missionID <= _tokenIDs.current(), "ID mission out of range");
        return datas[_missionID];
    }

    function getTokensLength() external view returns (uint256) {
        return _tokenIDs.current();
    }

    // function getFeaturesIndexer(
    //     uint _missionID
    // ) external view returns (uint[] memory) {
    //     return featuresIndexer[_missionID];
    // }
}
