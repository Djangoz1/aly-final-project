// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

// import "hardhat/console.sol";

import {DataTypes} from "../libraries/DataTypes.sol";
import {DisputeDatas} from "../libraries/disputes/DisputeDatas.sol";
import {Bindings} from "../libraries/Bindings.sol";
import {BindingsMint} from "../libraries/BindingsMint.sol";
import {IAccessControl} from "../interfaces/system/IAccessControl.sol";
import {IAddressSystem} from "../interfaces/system/IAddressSystem.sol";
import {IArbitratorsHub} from "../interfaces/escrow/IArbitratorsHub.sol";
import {IFactory} from "../interfaces/system/IFactory.sol";

import {IFeaturesHub} from "../interfaces/works/IFeaturesHub.sol";
import {IMissionsHub} from "../interfaces/works/IMissionsHub.sol";
import {Dispute} from "./Dispute.sol";

contract DisputesHub is Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIDs;

    error NotAllowed();
    /**
     * @notice dispute ID return data dispute
     */

    mapping(uint => address) public indexersDisputes;

    /**
     * @notice feature ID return dispute ID
     */
    mapping(uint => uint) public indexersFeatures;

    uint32 public constant MIN_RECLAMATION_PERIOD = 3 seconds; // Change to days on production
    uint32 public constant MAX_RECLAMATION_PERIOD = 30 seconds;
    uint8 public maxArbitrators = 10; // Increase on production

    IAddressSystem private _iAS;

    modifier onlyProxy() {
        require(
            msg.sender == _iAS.collectWorkInteraction(),
            "Must call by proxy bindings"
        );
        _;
    }

    constructor(address _addressSystem) {
        require(
            _addressSystem != address(0),
            "DisputesHub: Invalid address hub"
        );
        _iAS = IAddressSystem(_addressSystem);
        _iAS.setDisputesHub();
        require(
            _iAS.disputesHub() == address(this),
            "Failed construct disputes hub"
        );
    }

    // Ajoutez votre code ici

    function mint(
        address _to,
        uint256 _featureID,
        DataTypes.CourtIDs _courtID,
        uint32 _reclamationPeriod,
        uint8 _nbArbitrators,
        string memory _tokenURI
    ) external onlyProxy returns (bool) {
        DataTypes.FeatureData memory featureData = IFeaturesHub(
            _iAS.featuresHub()
        ).dataOf(_featureID);
        if (
            Bindings.ownerOf(_featureID, _iAS.featuresHub()) == _to ||
            Bindings.ownerOf(featureData.cvWorker, _iAS.cvsHub()) == _to
        ) {
            require(indexersFeatures[_featureID] == 0, "Dispute already added");
            require(
                _reclamationPeriod >= MIN_RECLAMATION_PERIOD &&
                    _reclamationPeriod <= MAX_RECLAMATION_PERIOD,
                "Invalid reclamation period"
            );
            require(_nbArbitrators <= maxArbitrators, "Exceed max arbitrators");
            DisputeDatas.Data memory _data = BindingsMint.checked(
                address(_iAS),
                _featureID,
                _courtID,
                _nbArbitrators,
                _reclamationPeriod,
                _tokenURI
            );
            _tokenIDs.increment();
            _data.id = _tokenIDs.current();
            indexersDisputes[_tokenIDs.current()] = IFactory(_iAS.factory())
                .mintDispute(_to, _data);
            indexersFeatures[_featureID] = _tokenIDs.current();
            return true;
        } else {
            return false;
        }
    }

    function metaevidence(
        uint _featureID
    ) external view returns (DataTypes.EvidenceData memory) {
        address _addrMH = _iAS.missionsHub();
        DataTypes.EvidenceData memory evidence;

        evidence.missionURI = Bindings.tokenURI(
            IFeaturesHub(_iAS.featuresHub()).dataOf(_featureID).missionID,
            _addrMH
        );
        evidence.featureURI = Bindings.tokenURI(_featureID, _iAS.featuresHub());

        return evidence;
    }

    function tokensLength() external view returns (uint) {
        return _tokenIDs.current();
    }

    function addressOf(uint _disputeID) external view returns (address) {
        require(
            indexersDisputes[_disputeID] != address(0),
            "Dispute not found"
        );
        return indexersDisputes[_disputeID];
    }

    function disputeOf(uint _featureID) external view returns (uint) {
        require(indexersFeatures[_featureID] != 0, "Dispute not found");
        return indexersFeatures[_featureID];
    }
}
