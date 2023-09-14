// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {DataTypes} from "./DataTypes.sol";
import {Bindings} from "./Bindings.sol";
import {DisputeDatas} from "./disputes/DisputeDatas.sol";
import "hardhat/console.sol";

import {IAddressHub} from "../interfaces/IAddressHub.sol";
import {IArbitratorsHub} from "../interfaces/IArbitratorsHub.sol";
import {IFeaturesHub} from "../interfaces/IFeaturesHub.sol";
import {IDisputesHub} from "../interfaces/IDisputesHub.sol";
import {Dispute} from "../escrow/Dispute.sol";

library BindingsMint {
    struct Data {
        uint256 id;
        uint8 nbArbitrators;
        uint32 reclamationPeriod;
        DataTypes.CourtIDs courtID;
        uint256 featureID;
        uint256 value;
        uint256 payerID; // cvID
        uint256 payeeID; // cvID
        string tokenURI;
    }

    function purecheck(
        DisputeDatas.Data memory _data
    ) public pure returns (bool) {
        require(
            _data.payeeID > 0 &&
                _data.payeeID != _data.payerID &&
                _data.payerID > 0 &&
                _data.nbArbitrators > 0 &&
                _data.value > 0 &&
                bytes(_data.tokenURI).length > 5,
            "Error : Dispute value error"
        );
        return true;
    }

    function checked(
        address _addressHub,
        uint256 _featureID,
        DataTypes.CourtIDs _courtID,
        uint8 _nbArbitrators,
        uint32 _reclamationPeriod,
        string memory _tokenURI
    ) internal view returns (DisputeDatas.Data memory) {
        DisputeDatas.Data memory _data;
        IAddressHub iAH = IAddressHub(_addressHub);
        address _addrFH = iAH.featuresHub();

        IArbitratorsHub iArH = IArbitratorsHub(iAH.arbitratorsHub());

        uint courtLength = iArH.getCourtLength(DataTypes.CourtIDs(_courtID));

        DataTypes.FeatureData memory featureData = IFeaturesHub(_addrFH)
            .getData(_featureID);

        if (
            _courtID == DataTypes.CourtIDs.Centralized ||
            _courtID == DataTypes.CourtIDs.Kleros
        ) {
            _nbArbitrators = 1;
        } else if (
            (_nbArbitrators == 0 || courtLength == 0) &&
            _nbArbitrators > courtLength &&
            courtLength < 3
        ) {
            _nbArbitrators = 1;
            _courtID = DataTypes.CourtIDs.Centralized;
        }
        _data.courtID = _courtID;
        _data.featureID = _featureID;
        _data.nbArbitrators = _nbArbitrators;
        _data.value = featureData.wadge;
        _data.payeeID = featureData.cvWorker;
        _data.payerID = Bindings.getCV(
            Bindings.ownerOf(_featureID, _addrFH),
            iAH.cvHub()
        );
        _data.reclamationPeriod = _reclamationPeriod;
        _data.tokenURI = _tokenURI;
        purecheck(_data);

        return _data;
    }
}
