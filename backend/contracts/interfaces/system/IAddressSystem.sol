// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

interface IAddressSystem {
    // *********** CV *********** //

    function cvsHub() external view returns (address);

    function challengesHub() external view returns (address);

    function challengersHub() external view returns (address);

    function setChallengesHub() external;

    function setChallengersHub() external;

    function setCVsHub() external;

    function setCVsDatasHub() external;

    function token() external view returns (address);

    function setToken() external;

    // *********** WORKS *********** //
    function collectWorkInteraction() external view returns (address);

    function missionsHub() external view returns (address);

    function featuresHub() external view returns (address);

    function setCollectWorkInteraction() external;

    function setFeaturesHub() external;

    function setMissionsHub() external;

    // *********** SYSTEMS *********** //
    function accessControl() external view returns (address);

    function balancesHub() external view returns (address);

    function factory() external view returns (address);

    function apiPost() external view returns (address);

    function apiPostPayable() external view returns (address);

    function apiGet() external view returns (address);

    function setFactory() external;

    function setBalancesHub() external;

    function setAccessControl() external;

    function setApiPost() external;

    function setApiPostPayable() external;

    function setApiGet() external;

    // *********** PUBLICATIONS *********** //

    function pubsHub() external view returns (address);

    function pubsDatasHub() external view returns (address);

    function setPubHub() external;

    function setPubsDatasHub() external;

    // *********** ESCROW *********** //
    function disputesHub() external view returns (address);

    function arbitratorsHub() external view returns (address);

    function disputesDatasHub() external view returns (address);

    function setDisputesDatasHub() external;

    function setArbitratorsHub() external;

    function setDisputesHub() external;

    // *********** LAUNCHPADS *********** //
    function launchpadsHub() external view returns (address);

    function launchpadsDatasHub() external view returns (address);

    function launchpadsInvestorsHub() external view returns (address);

    function setLaunchpadsHub() external;

    function setLaunchpadsDatasHub() external;

    function setLaunchpadsInvestorsHub() external;

    // Ajoutez votre code ici
}
