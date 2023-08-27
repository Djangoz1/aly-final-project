// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

import {DataTypes} from "../libraries/DataTypes.sol";
import {AddressHub} from "../storage/AddressHub.sol";
import {IMissionsHub} from "../interfaces/IMissionsHub.sol";
import {ICVHub} from "../interfaces/ICVHub.sol";
import {CollectWorkInteraction} from "../collect/CollectWorkInteraction.sol";

contract FeaturesHub is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIDs;

    /**
     * @notice each cv ID have an indexers of feature ID
     */
    mapping(uint => uint256[]) indexer;

    /**
     * @notice each feature id has an address
     */
    mapping(uint => DataTypes.FeatureData) datas;

    AddressHub addressHub;
    address addrCWI;

    modifier onlyProxy() {
        require(
            msg.sender == address(addressHub.accessControl()),
            "Must call function with proxy bindings"
        );
        _;
    }

    modifier onlyCollecter() {
        require(msg.sender == addrCWI, "Must call with collecter bindings");
        _;
    }

    modifier onlyOwnerOf(address _tokenOwner, uint _missionID) {
        IMissionsHub iMH = IMissionsHub(addressHub.missionsHub());
        require(iMH.ownerOf(_missionID) == _tokenOwner, "Not the owner");
        require(
            iMH.getData(_missionID).status == DataTypes.MissionStatus.Process,
            "Mission not open"
        );
        require(_missionID <= iMH.getTokensLength(), "ID mission out of range");
        _;
    }

    modifier onlyFeatureOpen(uint _featureID) {
        require(_featureID <= _tokenIDs.current(), "ID feature out of range");
        require(
            datas[_featureID].status == DataTypes.FeatureStatus.Process,
            "Wrong feature status"
        );
        _;
    }

    constructor(address _addressHub) ERC721("Feature", "WF") {
        addressHub = AddressHub(_addressHub);
        addressHub.setFeaturesHub(address(this));
        CollectWorkInteraction CWI = new CollectWorkInteraction(_addressHub);
        addrCWI = address(CWI);
    }

    function getAddressHub() external view returns (address) {
        return address(addressHub);
    }

    function getAddressCollectWorkInteraction()
        external
        view
        returns (address)
    {
        return addrCWI;
    }

    function getTokensLength() external view returns (uint) {
        return _tokenIDs.current();
    }

    /**
     * @param _owner is cv address

     */

    function mint(
        address _owner,
        uint _missionID,
        uint _wadge,
        uint16 _estimatedDays,
        bool _isInviteOnly,
        string memory _tokenURI
    ) external onlyProxy returns (uint) {
        IMissionsHub iMH = IMissionsHub(addressHub.missionsHub());
        // require(_missionID <= iMH.getTokensLength(), "ID mission out of range");
        require(iMH.ownerOf(_missionID) == _owner, "Not the owner");
        require(
            iMH.getData(_missionID).status == DataTypes.MissionStatus.Process,
            "Mission closed"
        );
        ICVHub cvHub = ICVHub(addressHub.cvHub());
        _tokenIDs.increment();
        uint newFeatureID = _tokenIDs.current();
        DataTypes.FeatureData memory newFeature;
        newFeature.id = newFeatureID;
        newFeature.missionID = _missionID;
        newFeature.wadge = _wadge;
        newFeature.estimatedDays = _estimatedDays;
        newFeature.isInviteOnly = _isInviteOnly;
        newFeature.tokenURI = _tokenURI;
        uint cvID = cvHub.getCV(_owner);
        indexer[cvID].push(newFeatureID);
        _mint(_owner, newFeatureID);
        _setTokenURI(newFeatureID, _tokenURI);
        datas[newFeatureID] = newFeature;
        CollectWorkInteraction CWI = CollectWorkInteraction(addrCWI);
        CWI.addFeature(newFeatureID);
        iMH.addFeature(_owner, _missionID, newFeatureID);
        return newFeatureID;
    }

    function setFeature(
        uint _featureID,
        DataTypes.FeatureData memory _data
    ) external onlyCollecter returns (bool) {
        datas[_featureID] = _data;
        return true;
    }

    function validFeature(uint _featureID) external {
        ICVHub iCVH = ICVHub(addressHub.cvHub());
        if (ownerOf(_featureID) == msg.sender) {
            require(
                iCVH.getCV(msg.sender) != _getData(_featureID).cvWorker,
                "Error missmatch cv"
            );
            _validFeature(_featureID, msg.sender);
        } else {
            require(
                iCVH.getCV(msg.sender) == _getData(_featureID).cvWorker,
                "Must call by owner or worker"
            );
            require(
                datas[_featureID].status != DataTypes.FeatureStatus.Contest,
                "Must wait end of litigation"
            );
            require(
                _getData(_featureID).estimatedDays +
                    _getData(_featureID).startedAt <
                    block.timestamp,
                "Must wait end of feature"
            );
            _validFeature(_featureID, ownerOf(_featureID));
        }
    }

    function _validFeature(
        uint _featureID,
        address _owner
    ) internal onlyOwnerOf(_owner, _getData(_featureID).missionID) {
        require(
            datas[_featureID].status != DataTypes.FeatureStatus.Validated,
            "Feature already validated"
        );
       
        require(datas[_featureID].cvWorker > 0, "Must have a worker");
        require(datas[_featureID].startedAt > 0, "Feature not start");

        datas[_featureID].status = DataTypes.FeatureStatus.Validated;

        // ! TO DO
        // ! Payment worker
    }

    function getIndexer(uint _owner) external view returns (uint[] memory) {
        require(indexer[_owner].length > 0, "No feature found");
        return indexer[_owner];
    }

    function _getData(
        uint _featureID
    ) internal view returns (DataTypes.FeatureData memory _data) {
        require(_featureID <= _tokenIDs.current(), "Feature ID out of range");
        return datas[_featureID];
    }

    function getData(
        uint _featureID
    ) external view returns (DataTypes.FeatureData memory _data) {
        return _getData(_featureID);
    }
}
