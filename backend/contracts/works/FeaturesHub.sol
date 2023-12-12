// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

import {DataTypes} from "../libraries/DataTypes.sol";
import {Bindings} from "../libraries/Bindings.sol";

import {IAddressSystem} from "../interfaces/system/IAddressSystem.sol";
import {IAPIPost} from "../interfaces/system/IAPIPost.sol";
import {IAPIPostPayable} from "../interfaces/system/IAPIPostPayable.sol";
import {IMissionsHub} from "../interfaces/works/IMissionsHub.sol";
import {ICollectWorkInteraction} from "../interfaces/works/ICollectWorkInteraction.sol";
import {IArbitratorsHub} from "../interfaces/escrow/IArbitratorsHub.sol";
import {ICVsHub} from "../interfaces/cv/ICVsHub.sol";

contract FeaturesHub is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIDs;

    /**
     * @notice each cv ID have an _indexers of feature ID
     */
    mapping(uint => uint256[]) _indexer;

    /**
     * @notice each feature id has an address
     */
    mapping(uint => DataTypes.FeatureData) _datas;

    IAddressSystem private _iAS;
    address public addrCWI;

    modifier onlyProxy() {
        require(
            msg.sender == address(_iAS.apiPost()) ||
                msg.sender == address(_iAS.apiPostPayable()),
            "Must call function with proxy bindings"
        );
        _;
    }
    modifier onlySatteliteContracts() {
        require(
            msg.sender == _iAS.disputesHub(),
            "Must call function with proxy bindings"
        );
        _;
    }

    modifier onlyCollecter() {
        require(
            msg.sender == _iAS.collectWorkInteraction(),
            "Must call with collecter bindings"
        );
        _;
    }

    modifier onlyOwnerOf(address _tokenOwner, uint _missionID) {
        address _addrMH = _iAS.missionsHub();

        require(
            Bindings.ownerOf(_missionID, _addrMH) == _tokenOwner,
            "Not the owner"
        );
        require(
            IMissionsHub(_addrMH).dataOf(_missionID).status ==
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
            _cvOf(_for) == _datas[_featureID].cvWorker ||
                _for == ownerOf(_featureID),
            "Link to feature not found"
        );
        _;
    }

    modifier onlyFeatureOpen(uint _featureID) {
        require(_featureID <= _tokenIDs.current(), "ID feature out of range");
        require(
            _datas[_featureID].status == DataTypes.FeatureStatus.Process,
            "Wrong feature status"
        );
        _;
    }

    constructor(address _addressSystem) ERC721("Feature", "WF") {
        _iAS = IAddressSystem(_addressSystem);
        _iAS.setFeaturesHub();
        require(
            _iAS.featuresHub() == address(this),
            "FeaturesHub: Error deployment"
        );
    }

    function tokensLength() external view returns (uint) {
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
        DataTypes.CourtIDs _specification,
        bool _payWithToken
    ) external onlyProxy returns (uint) {
        address _addrMH = _iAS.missionsHub();
        IMissionsHub iMH = IMissionsHub(_addrMH);
        require(
            iMH.dataOf(_missionID).status == DataTypes.MissionStatus.Process,
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
        newFeature.payWithToken = _payWithToken;
        uint cvID = _cvOf(_owner);
        _indexer[cvID].push(newFeatureID);
        _mint(_owner, newFeatureID);
        _setTokenURI(newFeatureID, _tokenURI);
        _datas[newFeatureID] = newFeature;
        ICollectWorkInteraction(_iAS.collectWorkInteraction()).addFeature(
            newFeatureID
        );
        iMH.addFeature(_missionID, newFeatureID);
        return newFeatureID;
    }

    function setFeature(
        uint _featureID,
        DataTypes.FeatureData memory _data
    ) external onlyCollecter returns (bool) {
        _datas[_featureID] = _data;
        return true;
    }

    function validFeature(
        address _sender,
        uint _featureID
    ) external onlyProxy checkLink(_sender, _featureID) {
        address _addrCVH = _iAS.cvsHub();

        IArbitratorsHub arbitratorsHub = IArbitratorsHub(_iAS.arbitratorsHub());
        if (ownerOf(_featureID) == _sender) {
            require(
                _cvOf(_sender) != _dataOf(_featureID).cvWorker,
                "Error missmatch cv"
            );
            _validFeature(_featureID, _sender);
        } else {
            require(
                _dataOf(_featureID).status != DataTypes.FeatureStatus.Contest,
                "Must wait end of litigation"
            );
            require(
                _dataOf(_featureID).estimatedDays +
                    _dataOf(_featureID).startedAt <
                    block.timestamp,
                "Must wait end of feature"
            );
            _validFeature(
                _featureID,
                Bindings.ownerOf(_dataOf(_featureID).cvWorker, _addrCVH)
            );
        }
        arbitratorsHub.setArbitrator(
            _dataOf(_featureID).cvWorker,
            _dataOf(_featureID).specification
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
            _datas[_featureID].status != DataTypes.FeatureStatus.Validated,
            "Feature already validated"
        );

        require(_datas[_featureID].cvWorker > 0, "Must have a worker");
        require(_datas[_featureID].startedAt > 0, "Feature not start");
        IAPIPostPayable iAPIPostPayable = IAPIPostPayable(
            _iAS.apiPostPayable()
        );

        uint amount = _datas[_featureID].wadge;
        // ! TO DO

        bool success = iAPIPostPayable.sendTransaction(_for, amount);
        require(success, "Transaction failed");
        _datas[_featureID].wadge = 0;
        _datas[_featureID].status = DataTypes.FeatureStatus.Validated;
        return true;
    }

    function resolvedDispute(
        uint _cvID,
        uint _featureID
    )
        external
        payable
        checkLink(Bindings.ownerOf(_cvID, _iAS.cvsHub()), _featureID)
        returns (bool)
    {
        bool success = _validFeature(
            _featureID,
            Bindings.ownerOf(_cvID, _iAS.cvsHub())
        );
        return success;
    }

    function indexerOf(uint _cvID) external view returns (uint[] memory) {
        return _indexer[_cvID];
    }

    function _dataOf(
        uint _featureID
    ) internal view returns (DataTypes.FeatureData memory _data) {
        require(_featureID <= _tokenIDs.current(), "Feature ID out of range");
        return _datas[_featureID];
    }

    function _cvOf(address _for) internal view returns (uint) {
        address _CVsHub = _iAS.cvsHub();
        return Bindings.cvOf(_for, _CVsHub);
    }

    function dataOf(
        uint _featureID
    ) external view returns (DataTypes.FeatureData memory _data) {
        return _dataOf(_featureID);
    }
}
