// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

import {DataTypes} from "../libraries/DataTypes.sol";
import {Bindings} from "../libraries/Bindings.sol";
import {IAddressHub} from "../interfaces/IAddressHub.sol";
import {IAPIPost} from "../interfaces/IAPIPost.sol";
import {IMissionsHub} from "../interfaces/IMissionsHub.sol";
import {IAccessControl} from "../interfaces/IAccessControl.sol";
import {IArbitratorsHub} from "../interfaces/IArbitratorsHub.sol";
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

    IAddressHub private _iAH;
    address public addrCWI;

    modifier onlyProxy() {
        require(
            msg.sender == address(_iAH.apiPost()),
            "Must call function with proxy bindings"
        );
        _;
    }
    modifier onlySatteliteContracts() {
        require(
            msg.sender == _iAH.disputesHub(),
            "Must call function with proxy bindings"
        );
        _;
    }

    modifier onlyCollecter() {
        require(
            msg.sender == _iAH.collectWorkInteraction(),
            "Must call with collecter bindings"
        );
        _;
    }

    modifier onlyOwnerOf(address _tokenOwner, uint _missionID) {
        address _addrMH = _iAH.missionsHub();

        require(
            Bindings.ownerOf(_missionID, _addrMH) == _tokenOwner,
            "Not the owner"
        );
        require(
            IMissionsHub(_addrMH).getData(_missionID).status ==
                DataTypes.MissionStatus.Process,
            "Mission not open"
        );
        require(
            _missionID <= Bindings.tokensLength(_addrMH),
            "ID mission out of range"
        );
        _;
    }

    modifier checkLink(address _for, uint _featureID) {
        require(
            _getCV(_for) == datas[_featureID].cvWorker ||
                _for == ownerOf(_featureID),
            "Link to feature not found"
        );
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
        _iAH = IAddressHub(_addressHub);
        CollectWorkInteraction CWI = CollectWorkInteraction(
            _iAH.collectWorkInteraction()
        );

        addrCWI = address(CWI);
        _iAH.setFeaturesHub();
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
        string memory _tokenURI,
        DataTypes.CourtIDs _specification
    ) external onlyProxy returns (uint) {
        address _addrMH = _iAH.missionsHub();
        IMissionsHub iMH = IMissionsHub(_addrMH);
        require(
            iMH.getData(_missionID).status == DataTypes.MissionStatus.Process,
            "Mission closed"
        );
        require(
            _specification != DataTypes.CourtIDs.Centralized &&
                _specification != DataTypes.CourtIDs.Kleros,
            "Unvalid specification"
        );

        _tokenIDs.increment();
        uint newFeatureID = _tokenIDs.current();
        DataTypes.FeatureData memory newFeature;
        newFeature.id = newFeatureID;
        newFeature.missionID = _missionID;
        newFeature.wadge = _wadge;
        newFeature.estimatedDays = _estimatedDays;
        newFeature.isInviteOnly = _isInviteOnly;
        newFeature.specification = _specification;
        uint cvID = _getCV(_owner);
        indexer[cvID].push(newFeatureID);
        _mint(_owner, newFeatureID);
        _setTokenURI(newFeatureID, _tokenURI);
        datas[newFeatureID] = newFeature;
        CollectWorkInteraction CWI = CollectWorkInteraction(
            _iAH.collectWorkInteraction()
        );
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

    function validFeature(
        address _sender,
        uint _featureID
    ) external onlyProxy checkLink(_sender, _featureID) {
        address _addrCVH = _iAH.cvHub();

        IArbitratorsHub arbitratorsHub = IArbitratorsHub(_iAH.arbitratorsHub());
        if (ownerOf(_featureID) == _sender) {
            require(
                _getCV(_sender) != _getData(_featureID).cvWorker,
                "Error missmatch cv"
            );
            _validFeature(_featureID, _sender);
        } else {
            require(
                _getData(_featureID).status != DataTypes.FeatureStatus.Contest,
                "Must wait end of litigation"
            );
            require(
                _getData(_featureID).estimatedDays +
                    _getData(_featureID).startedAt <
                    block.timestamp,
                "Must wait end of feature"
            );
            _validFeature(
                _featureID,
                Bindings.ownerOf(_getData(_featureID).cvWorker, _addrCVH)
            );
        }
        arbitratorsHub.setArbitrator(
            _getData(_featureID).cvWorker,
            _getData(_featureID).specification
        );
    }

    function _validFeature(
        uint _featureID,
        address _for
    ) internal returns (bool) {
        require(
            _featureID > 0 && _featureID <= _tokenIDs.current(),
            "Invalid feature ID"
        );
        require(
            datas[_featureID].status != DataTypes.FeatureStatus.Validated,
            "Feature already validated"
        );

        require(datas[_featureID].cvWorker > 0, "Must have a worker");
        require(datas[_featureID].startedAt > 0, "Feature not start");
        IAPIPost iAPIPost = IAPIPost(_iAH.apiPost());

        uint amount = datas[_featureID].wadge;
        // ! TO DO

        bool success = iAPIPost.sendTransaction(_for, amount);
        require(success, "Transaction failed");
        datas[_featureID].wadge = 0;
        datas[_featureID].status = DataTypes.FeatureStatus.Validated;
        return true;
    }

    function resolvedDispute(
        uint _cvID,
        uint _featureID
    )
        external
        payable
        checkLink(Bindings.ownerOf(_cvID, _iAH.cvHub()), _featureID)
        returns (bool)
    {
        bool success = _validFeature(
            _featureID,
            Bindings.ownerOf(_cvID, _iAH.cvHub())
        );
        return success;
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

    function _getCV(address _for) internal view returns (uint) {
        address _cvHub = _iAH.cvHub();
        return Bindings.getCV(_for, _cvHub);
    }

    function getData(
        uint _featureID
    ) external view returns (DataTypes.FeatureData memory _data) {
        return _getData(_featureID);
    }
}
