// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";

import {DataTypes} from "../libraries/DataTypes.sol";
import {IAccessControl} from "../interfaces/system/IAccessControl.sol";
import {DisputeRules} from "../libraries/disputes/DisputeRules.sol";
import {Bindings} from "../libraries/Bindings.sol";

import {IAPIGet} from "../interfaces/system/IAPIGet.sol";
import {IBalancesHub} from "../interfaces/system/IBalancesHub.sol";
import {IContract} from "../interfaces/system/IContract.sol";
import {IAddressSystem} from "../interfaces/system/IAddressSystem.sol";
import {ICVsHub} from "../interfaces/cv/ICVsHub.sol";
import {ICVsDatasHub} from "../interfaces/cv/ICVsDatasHub.sol";
import {IArbitratorsHub} from "../interfaces/escrow/IArbitratorsHub.sol";
import {IDispute} from "../interfaces/escrow/IDispute.sol";
import {IDisputesHub} from "../interfaces/escrow/IDisputesHub.sol";
import {IPubsHub} from "../interfaces/pubs/IPubsHub.sol";
import {IPubsDatasHub} from "../interfaces/pubs/IPubsDatasHub.sol";
import {IMissionsHub} from "../interfaces/works/IMissionsHub.sol";
import {ILaunchpadHub} from "../interfaces/launchpads/ILaunchpadHub.sol";
import {ILaunchpadsDatasHub} from "../interfaces/launchpads/ILaunchpadsDatasHub.sol";
import {ILaunchpad} from "../interfaces/launchpads/ILaunchpad.sol";
import {IFeaturesHub} from "../interfaces/works/IFeaturesHub.sol";
import {ICollectWorkInteraction} from "../interfaces/works/ICollectWorkInteraction.sol";

contract APIPostPayable is Ownable {
    IAddressSystem private _iAS;
    IAPIGet private _iAPIGet;
    IBalancesHub private _iBalancesHub;

    address private _cvsHub;

    address private _cvsDatasHub;
    address private _collectWorkInteraction;
    address private _featuresHub;
    address private _missionsHub;
    address private _pubsHub;
    address private _pubsDatasHub;
    address private _disputesHub;
    address private _launchpadsHub;

    modifier onlyCVOwner() {
        require(_cvOf(msg.sender) > 0, "Must have CV");
        _;
    }

    modifier onlySatteliteContracts() {
        require(
            _disputesHub == msg.sender ||
                _featuresHub == msg.sender ||
                _launchpadsHub == msg.sender,
            "Only callable by our contracts"
        );
        _;
    }

    modifier onlyOwnerOf(
        uint _id,
        address _owner,
        address _contract
    ) {
        require(Bindings.ownerOf(_id, _contract) == _owner, "Not the owner");
        _;
    }

    constructor(address _addressSystem) {
        _iAS = IAddressSystem(_addressSystem);
        _iAS.setApiPostPayable();

        require(
            _iAS.apiPostPayable() == address(this),
            "APIPost : Address system failure"
        );
        _iAPIGet = IAPIGet(_iAS.apiGet());
        _cvsHub = _iAS.cvsHub();
        _cvsDatasHub = _iAS.cvsDatasHub();
        _collectWorkInteraction = _iAS.collectWorkInteraction();
        _featuresHub = _iAS.featuresHub();
        _missionsHub = _iAS.missionsHub();
        _launchpadsHub = _iAS.launchpadsHub();
        _pubsHub = _iAS.pubsHub();
        _pubsDatasHub = _iAS.pubsDatasHub();
        _disputesHub = _iAS.disputesHub();
        _iBalancesHub = IBalancesHub(_iAS.balancesHub());
        require(
            address(_iAPIGet) != address(0) &&
                _cvsHub != address(0) &&
                _cvsDatasHub != address(0) &&
                _launchpadsHub != address(0) &&
                _pubsHub != address(0) &&
                _pubsDatasHub != address(0) &&
                _collectWorkInteraction != address(0) &&
                _missionsHub != address(0) &&
                address(_iBalancesHub) != address(0) &&
                _featuresHub != address(0),
            "APIPost : Deployment failed"
        );
    }

    function sendTransaction(
        address _to,
        uint _value
    ) external payable onlySatteliteContracts returns (bool) {
        // Transférer les ETH à l'adresse spécifiée
        require(_to != address(0), "0 address");
        require(_value > 0, "Erorr value");
        (bool success, ) = _to.call{value: _value}("");
        require(success, "apiPost : Transaction failed");
        return true;
    }

    // ************* -------- ************* //
    // ************* Missions ************* //
    // ************* -------- ************* //

    function createMission(
        string calldata _tokenURI
    ) external payable onlyCVOwner {
        require(
            msg.value == _iBalancesHub.missionPrice(),
            "Mission price : Invalid value"
        );

        IMissionsHub(_missionsHub).mint(msg.sender, _tokenURI, 0);
    }

    /**
     * @notice Binding for close mission
     * @param _missionID is for id of mission to close. It's must be an owned mission
     * @dev this function trigger MissionsHub contract
     * msg.sender == ownerOfCV(x) && ownerOfMission(_missionID)
     */

    // function followMission(uint _IDToFollow) external onlyCVOwner {}

    // function unfollowMission(uint _IDToUnfollow) external onlyCVOwner {}

    // ************* -------- ************* //
    // ************* Features ************* //
    // ************* -------- ************* //

    /**
     * @notice Binding for create feature
     * @param _missionID is for id of mission linked to feature. It's must be an owned mission
     * @param _estimatedDays when _estimatedDays + startedAt == block.timestamp worker can claim his wadge
     * @param _isInviteOnly is a boolean if == true > workers can askTojoin if  == false can't
     * @param _tokenURI is for pinataCRUD by exemple
     * @param _specification is specification of feature. Si un litige a lieu alors il sera jugé par la court spécialisé. Si il n'a pas lieu le worker intègreras la court
     * @dev this function trigger MissionsHub && CollectWorkInteraction && MissionsHub contracts
     * msg.sender == ownerOfCV(x) && ownerOfMission(_missionID)
     * msg.value > 0
     */

    function createFeature(
        uint _missionID,
        uint16 _estimatedDays,
        bool _isInviteOnly,
        string calldata _tokenURI,
        DataTypes.CourtIDs _specification
    )
        external
        payable
        onlyCVOwner
        onlyOwnerOf(_missionID, msg.sender, _missionsHub)
    {
        require(msg.value > 0, "Insuficient value");
        uint newFeature = IFeaturesHub(_featuresHub).mint(
            msg.sender,
            _missionID,
            msg.value,
            _estimatedDays,
            _isInviteOnly,
            _tokenURI,
            _specification
        );

        require(newFeature > 0, "Error creation feature");
    }

    function investOnCourt(DataTypes.CourtIDs _courtID) external payable {
        require(msg.value > 0, "Invalid value");
        IArbitratorsHub(_iAS.arbitratorsHub()).investOnCourt(
            _cvOf(msg.sender),
            msg.value,
            _courtID
        );
    }

    // ************* --------- ************* //
    // ************* Launchpad ************* //
    // ************* --------- ************* //

    function createLaunchpad(
        DataTypes.LaunchpadData memory _datas,
        DataTypes.TierData[] memory _tierDatas,
        string memory _tokenURI
    ) external payable {
        uint cvID = _cvOf(msg.sender);

        require(
            msg.value == _iBalancesHub.launchpadPrice() &&
                _datas.tokenAddress != address(0),
            "APIPost: Error create launchpad"
        );
        //
        _datas.maxCap = 0;
        if (_datas.saleStart < block.timestamp) {
            _datas.saleStart = block.timestamp;
        }
        _datas.minCap = 0;

        uint256[] memory _maxTierCaps = new uint256[](_tierDatas.length);
        uint256[] memory _minTierCaps = new uint256[](_tierDatas.length);
        uint256[] memory _tokenPrice = new uint256[](_tierDatas.length);

        for (uint256 index = 0; index < _tierDatas.length; index++) {
            DataTypes.TierData memory _tierData = _tierDatas[index];
            _maxTierCaps[index] = _tierData.maxTierCap;
            _minTierCaps[index] = _tierData.minTierCap;
            _tokenPrice[index] = _tierData.tokenPrice;
            _datas.maxCap += _tierData.maxTierCap;
            _datas.minCap += _tierData.minTierCap;
            require(
                _tierData.tokenPrice < _datas.maxCap &&
                    _tierData.tokenPrice < _datas.maxInvest &&
                    _datas.minInvest <= _tierData.maxTierCap,
                "LaunchpadHub: Missmatch value"
            );
        }

        _datas.numberOfTier = uint8(_tierDatas.length);

        //
        uint newID = ILaunchpadHub(_launchpadsHub).mint(
            cvID,
            _datas,
            _tierDatas
        );
        require(newID > 0, "Invalid launchpad ID");

        //!>>
        _datas.id = newID;

        ILaunchpadsDatasHub cLD = ILaunchpadsDatasHub(
            _iAS.launchpadsDatasHub()
        );
        cLD.setLaunchpadData(newID, msg.sender, _datas);
        cLD._setTiers(
            _tierDatas.length,
            newID,
            _maxTierCaps,
            _minTierCaps,
            _tokenPrice
        );
        //
        // ILaunchpadsDatasHub(_iAS.launchpadsDatasHub()).setTokenURI(
        cLD.setTokenURI(msg.sender, newID, _tokenURI);
    }

    function buyTokens(uint _launchpadID) external payable {
        require(msg.value > 0, "Value must be more than 0");

        bool success = ILaunchpad(_launchpadAddr(_launchpadID)).buyTokens(
            _cvOf(msg.sender),
            msg.value
        );
        require(success, "APIPost: Error buy tokens");
        _iBalancesHub.addLaunchpadBalance(_launchpadID, msg.value);
    }

    function _cvOf(address _for) internal view returns (uint) {
        return _iAPIGet.cvOf(_for);
    }

    function _launchpadAddr(uint _launchpadID) internal view returns (address) {
        return _iAPIGet.addressOfLaunchpad(_launchpadID);
    }

    function _disputeAddr(uint _disputeID) internal view returns (address) {
        return _iAPIGet.addressOfDispute(_disputeID);
    }
}
