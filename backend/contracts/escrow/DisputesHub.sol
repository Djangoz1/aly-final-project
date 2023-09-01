// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "hardhat/console.sol";

import {DataTypes} from "../libraries/DataTypes.sol";
import {IAccessControl} from "../interfaces/IAccessControl.sol";
import {IAddressHub} from "../interfaces/IAddressHub.sol";
import {IArbitratorsHub} from "../interfaces/IArbitratorsHub.sol";
import {ICVHub} from "../interfaces/ICVHub.sol";
import {IFeaturesHub} from "../interfaces/IFeaturesHub.sol";
import {IMissionsHub} from "../interfaces/IMissionsHub.sol";
import {Dispute} from "./Dispute.sol";
import {IDispute} from "../interfaces/IDispute.sol";

contract DisputesHub {
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

    uint public MIN_RECLAMATION_PERIOD = 5 days;
    uint public MAX_RECLAMATION_PERIOD = 30 days;

    IAddressHub public addressHub;
    address addrCWI;
    modifier onlyProxy() {
        require(msg.sender == addrCWI, "Must call by proxy bindings");
        _;
    }

    constructor(address _addressHub) {
        require(_addressHub != address(0), "DisputesHub: Invalid address hub");
        addressHub = IAddressHub(_addressHub);
        addressHub.setDisputesHub(address(this));
        IFeaturesHub featuresHub = IFeaturesHub(addressHub.featuresHub());
        addrCWI = featuresHub.addrCWI();
    }

    // Ajoutez votre code ici

    function mint(
        address _to,
        uint _featureID,
        DataTypes.CourtIDs _courtID,
        uint _reclamationPeriod,
        uint _nbArbitrators,
        string memory _tokenURI
    ) external onlyProxy returns (bool) {
        ICVHub cvHub = ICVHub(addressHub.cvHub());
        IFeaturesHub featuresHub = IFeaturesHub(addressHub.featuresHub());
        IArbitratorsHub arbitratorsHub = IArbitratorsHub(
            addressHub.arbitratorsHub()
        );

        DataTypes.FeatureData memory featureData = featuresHub.getData(
            _featureID
        );

        if (
            featuresHub.ownerOf(_featureID) == _to ||
            cvHub.ownerOf(featureData.cvWorker) == _to
        ) {
            require(indexersFeatures[_featureID] == 0, "Dispute already added");
            require(
                _reclamationPeriod >= MIN_RECLAMATION_PERIOD &&
                    _reclamationPeriod <= MAX_RECLAMATION_PERIOD,
                "Invalid reclamation period"
            );
            uint courtLength = arbitratorsHub.getCourtLength(
                DataTypes.CourtIDs(_courtID)
            );
            DataTypes.DisputeData memory _data;

            if (_nbArbitrators == 0 || courtLength == 0) {
                _nbArbitrators = 0;
                _data.courtID = DataTypes.CourtIDs.Centralized;
            } else if (_nbArbitrators > courtLength && courtLength < 3) {
                _data.courtID == DataTypes.CourtIDs.Centralized;
                _nbArbitrators = courtLength;
            } else {
                _data.courtID = _courtID;
            }
            _tokenIDs.increment();
            _data.id = _tokenIDs.current();
            _data.nbArbitrators = _nbArbitrators;
            _data.reclamationPeriod = _reclamationPeriod;
            _data.value = featureData.wadge;
            _data.tokenURI = _tokenURI;
            _data.payeeID = featureData.cvWorker;
            _data.payerID = cvHub.getCV(featuresHub.ownerOf(_featureID));
            indexersFeatures[_featureID] = _tokenIDs.current();
            Dispute dispute = new Dispute(address(addressHub), _to, _data, _featureID);
            indexersDisputes[_tokenIDs.current()] = address(dispute);

            return true;
        } else {
            revert NotAllowed();
        }
    }

      function metaevidence(uint _featureID)
        external
        view
        returns (DataTypes.EvidenceData memory)
    {
        DataTypes.EvidenceData memory evidence;

        IFeaturesHub iFH = IFeaturesHub(addressHub.featuresHub());
        IMissionsHub iMH = IMissionsHub(addressHub.missionsHub());
        // IDispute dispute = IDispute(indexersDisputes[indexersFeatures[_featureID]]);
        evidence.missionURI = iMH.tokenURI(iFH.getData(_featureID).missionID);
        evidence.featureURI = iFH.tokenURI(_featureID);
        
        return evidence;
    }

    function getTokensLength() external view returns (uint) {
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
