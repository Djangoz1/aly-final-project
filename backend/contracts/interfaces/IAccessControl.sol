// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {DataTypes} from "../libraries/DataTypes.sol";

interface IAccessControl {
    function initWorkflow() external;

    function hasRegistred(address _forCheck) external pure;

    function setPubHub(address _pubHub) external;

    function getPubHub() external view returns (address);

    function setCVHub(address _CVHub) external;

    function getCVHub() external view returns (address);

    function setFeaturesHub(address _featuresHub) external;

    function getFeaturesHub() external view returns (address);

    function setMissionsHub(address _missionsHub) external;

    function getMissionsHub() external view returns (address);

    function getWorkerProposalHub() external view returns (address);

    function setWorkerProposalHub(address _workerProposalHub) external;

    function setLaunchpadHub(address _launchpadHub) external;

    function setLaunchpadCohort(address _launchpadCohort) external;

    function getLaunchpadCohort() external view returns (address);

    function buyCV() external returns (address);

    function createPub(string calldata _tokenURI) external returns (uint);

    function createPub(
        string calldata _tokenURI,
        address _sender
    ) external returns (uint);

    function getPubIndexers(
        address _addr
    ) external view returns (uint[] memory);

    function sendTransaction(
        address _to,
        uint _value
    ) external payable returns (bool);
}
