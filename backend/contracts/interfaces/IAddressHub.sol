// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

interface IAddressHub {
    function accessControl() external view returns (address);

    function pubsHub() external view returns (address);

    function cvHub() external view returns (address);

    function missionsHub() external view returns (address);

    function setAccessControl(address _accessControl) external;

    function setPubHub(address _pubHub) external;

    function setCVHub(address _CVHub) external;

    function setFeaturesHub(address _featuresHub) external;

    function setMissionsHub(address _missionsHub) external;

    function setWorkerProposalHub(address _workerProposalHub) external;

    function setLaunchpadHub(address _launchpadHub) external;

    function setLaunchpadCohort(address _launchpadCohort) external;

    // Ajoutez votre code ici
}
