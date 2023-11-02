// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

import {DataTypes} from "../libraries/DataTypes.sol";
import {Bindings} from "../libraries/Bindings.sol";

import {IAddressSystem} from "../interfaces/system/IAddressSystem.sol";
import {ICVsHub} from "../interfaces/cv/ICVsHub.sol";

contract MissionsHub is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIDs;

    IAddressSystem private _iAS;

    /**
     * @notice cv ID return array of ID missions
     */
    mapping(uint => uint[]) private indexers;

    mapping(uint => uint[]) private indexersLaunchpad;

    /**
     * @notice mission ID return data mission
     */
    mapping(uint => DataTypes.MissionData) private datas;

    modifier onlyProxy() {
        require(
            msg.sender == address(_iAS.apiPost()) ||
                msg.sender == address(_iAS.apiPostPayable()),
            "Must call function with proxy bindings"
        );
        _;
    }

    modifier onlyFeaturesHub() {
        require(
            msg.sender == _iAS.featuresHub(),
            "Must call function with featuresHub bindings"
        );
        _;
    }

    // *::::::::::::: ----------- ::::::::::::* //
    // *::::::::::::: CONSTRUCTOR ::::::::::::* //
    // *::::::::::::: ----------- ::::::::::::* //

    constructor(address _addrHub) ERC721("Mission", "WM") {
        _iAS = IAddressSystem(_addrHub);
        _iAS.setMissionsHub();
        require(
            _iAS.missionsHub() == address(this),
            "MissionsHub: Error deployment"
        );
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
        string calldata _tokenURI,
        uint _launchpadID
    ) external onlyProxy returns (uint) {
        _tokenIDs.increment();
        uint newMissionID = _tokenIDs.current();
        DataTypes.MissionData memory newMission;
        newMission.id = newMissionID;
        newMission.launchpad = _launchpadID;
        if (_launchpadID > 0) {
            indexersLaunchpad[_launchpadID].push(newMissionID);
        }
        indexers[_cvOf(_for)].push(newMissionID);
        datas[newMissionID] = newMission;

        _mint(_for, newMissionID);
        _setTokenURI(newMissionID, _tokenURI);
        return newMissionID;
    }

    function addFeature(
        address _owner,
        uint _missionID,
        uint _featureID
    ) external onlyFeaturesHub {
        require(
            datas[_missionID].status == DataTypes.MissionStatus.Process,
            "Mission closed"
        );
        datas[_missionID].features.push(_featureID);
    }

    function closeMission(uint _missionID) external onlyProxy {
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

    function indexerOf(uint _cvID) external view returns (uint[] memory) {
        require(
            _cvID > 0 && _cvID <= Bindings.tokensLength(_iAS.cvsHub()),
            "MissionsHub : Invalid cv ID"
        );
        return indexers[_cvID];
    }

    function indexerOfLaunchpad(
        uint _launchpadID
    ) external view returns (uint[] memory) {
        return indexersLaunchpad[_launchpadID];
    }

    function dataOf(
        uint _missionID
    ) external view returns (DataTypes.MissionData memory) {
        require(_missionID <= _tokenIDs.current(), "ID mission out of range");
        return datas[_missionID];
    }

    function tokensLength() external view returns (uint256) {
        return _tokenIDs.current();
    }

    function _cvOf(address _for) internal view returns (uint) {
        return Bindings.cvOf(_for, _iAS.cvsHub());
    }
}
