// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

import {IAddressHub} from "../interfaces/IAddressHub.sol";
import {ICVHub} from "../interfaces/ICVHub.sol";
import {DataTypes} from "../libraries/DataTypes.sol";
import {Bindings} from "../libraries/Bindings.sol";

contract MissionsHub is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIDs;

    IAddressHub private _iAH;

    /**
     * @notice cv ID return array of ID missions
     */
    mapping(uint => uint[]) private indexers;

    /**
     * @notice mission ID return data mission
     */
    mapping(uint => DataTypes.MissionData) private datas;

    
    modifier onlyProxy() {
        require(
            msg.sender == address(_iAH.apiPost()),
            "Must call function with proxy bindings"
        );
        _;
    }

    modifier onlyFeaturesHub() {
        require(
            msg.sender == _iAH.featuresHub(),
            "Must call function with featuresHub bindings"
        );
        _;
    }

    // *::::::::::::: ----------- ::::::::::::* //
    // *::::::::::::: CONSTRUCTOR ::::::::::::* //
    // *::::::::::::: ----------- ::::::::::::* //

    constructor(address _addrHub) ERC721("Mission", "WM") {
        _iAH = IAddressHub(_addrHub);
        _iAH.setMissionsHub();
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
        _tokenIDs.increment();
        uint newMissionID = _tokenIDs.current();
        DataTypes.MissionData memory newMission;
        newMission.id = newMissionID;
        indexers[_getCV(_for)].push(newMissionID);
        datas[newMissionID] = newMission;
        _mint(_for, newMissionID);
        _setTokenURI(newMissionID, _tokenURI);
        return newMissionID;
    }

    function addFeature(
        address _owner,
        uint _missionID,
        uint _featureID
    ) external onlyFeaturesHub  {
        require(
            datas[_missionID].status == DataTypes.MissionStatus.Process,
            "Mission closed"
        );
        datas[_missionID].features.push(_featureID);
    }

    function closeMission(
        uint _missionID
        
    ) external onlyProxy  {
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

    function _getCV(address _for) internal view returns (uint) {
        return Bindings.getCV(_for, _iAH.cvHub());
    }
}
