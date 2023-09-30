// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {DataTypes} from "../../libraries/DataTypes.sol";

interface ICollectWorkInteraction {
    function addFeature(uint _featureID) external;

    function inviteWorker(
        uint _cvID,
        uint _cvWorkerID,
        uint _featureID
    ) external;

    function invitesOf(uint _cvID) external view returns (uint[] memory);

    function acceptJob(uint _cvID, uint _featureID) external;

    function declineJob(uint _cvID, uint _featureID) external;

    function askToJoin(uint _cvID, uint _featureID) external;

    function signWorker(
        uint _featureID,
        uint _cvWorkerID
    ) external returns (bool);

    function improveFeature(uint _featureID, uint16 _estimatedDays) external;

    function contestFeature(
        uint _cvID,
        uint _featureID,
        uint32 _reclamationPeriod,
        uint8 _nbArbitrators,
        string memory _tokenURI
    ) external returns (bool);

    function jobsOf(uint _cvID) external view returns (uint[] memory);

    function dataOf(
        uint _featureID
    ) external view returns (DataTypes.FeatureInteractionData memory);
}
