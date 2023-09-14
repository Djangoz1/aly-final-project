// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

interface IAddressHub {
    function accessControl() external view returns (address);

    function pubsHub() external view returns (address);

    function collectPubs() external view returns (address);

    function collectFollowCV() external view returns (address);

    function collectWorkInteraction() external view returns (address);

    function disputesHub() external view returns (address);

    function launchpadCohort() external view returns (address);

    function launchpadsHub() external view returns (address);

    function arbitratorsHub() external view returns (address);

    function cvHub() external view returns (address);

    function balancesHub() external view returns (address);

    function factory() external view returns (address);

    function featuresHub() external view returns (address);

    function apiPost() external view returns (address);

    function missionsHub() external view returns (address);

    function escrowDatasHub() external view returns (address);

    function setFactory() external;

    function setBalancesHub() external;

    function setEscrowDatasHub() external;

    function setAccessControl() external;

    function setApiPost() external;

    function setLaunchpadsHub() external;

    function setPubHub() external;

    function setCollectPubs() external;

    function setCVHub() external;

    function setCollectFollowCV() external;

    function setArbitratorsHub() external;

    function setDisputesHub() external;

    function setCollectWorkInteraction() external;

    function setFeaturesHub() external;

    function setMissionsHub() external;

    function setWorkerProposalHub() external;

    function setLaunchpadHub() external;

    function setLaunchpadCohort() external;

    // Ajoutez votre code ici
}
