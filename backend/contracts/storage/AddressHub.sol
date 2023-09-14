// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

import {IAccessControl} from "../interfaces/IAccessControl.sol";
import {DataTypes} from "../libraries/DataTypes.sol";

contract AddressHub is Ownable {
    address public apiPost;
    address public accessControl;
    address public missionsHub;
    address public factory;
    address public balancesHub;
    address public cvHub;
    address public pubsHub;
    address public featuresHub;
    address public launchpadsHub;
    address public collectFollowCV;
    address public collectWorkInteraction;
    address public disputesHub;
    address public arbitratorsHub;
    address public collectPubs;
    address public workerProposalHub;
    address public launchpadCohort;
    address public escrowDatasHub;

    function _hasInit() internal {
        if (
            apiPost != address(0) &&
            accessControl != address(0) &&
            arbitratorsHub != address(0) &&
            launchpadsHub != address(0) &&
            balancesHub != address(0) &&
            collectWorkInteraction != address(0) &&
            disputesHub != address(0) &&
            missionsHub != address(0) &&
            collectFollowCV != address(0) &&
            cvHub != address(0) &&
            pubsHub != address(0) &&
            collectPubs != address(0) &&
            featuresHub != address(0) &&
            workerProposalHub != address(0) &&
            factory != address(0) &&
            escrowDatasHub != address(0) &&
            launchpadCohort != address(0)
        ) {
            IAccessControl iAC = IAccessControl(accessControl);
            iAC.initWorkflow();
        }
    }

    function setApiPost() external {
        require(apiPost == address(0), "APIPost already init");
        apiPost = msg.sender;
        _hasInit();
    }

    function setFactory() external {
        require(factory == address(0), "Factory already init");
        factory = msg.sender;
        _hasInit();
    }

    function setEscrowDatasHub() external {
        require(escrowDatasHub == address(0), "EscrowDatasHub already init");
        escrowDatasHub = msg.sender;
        _hasInit();
    }

    function setCollectFollowCV() external {
        require(collectFollowCV == address(0), "CollectFollowCV already init");
        collectFollowCV = msg.sender;
        _hasInit();
    }

    function setBalancesHub() external {
        require(balancesHub == address(0), "BalancesHub already init");
        balancesHub = msg.sender;
        _hasInit();
    }

    function setCollectWorkInteraction() external {
        require(
            collectWorkInteraction == address(0),
            "CollectWorkInteraction already init"
        );
        collectWorkInteraction = msg.sender;
        _hasInit();
    }

    function setAccessControl() external {
        require(accessControl == address(0), "AccessControl already init");
        accessControl = msg.sender;
        _hasInit();
    }

    function setArbitratorsHub() external {
        require(arbitratorsHub == address(0), "ArbitratorsHub already init");
        arbitratorsHub = msg.sender;
        _hasInit();
    }

    function setLaunchpadsHub() external {
        require(launchpadsHub == address(0), "ArbitratorsHub already init");
        launchpadsHub = msg.sender;
        _hasInit();
    }

    function setDisputesHub() external {
        require(disputesHub == address(0), "DisputesHub already init");
        disputesHub = msg.sender;
        _hasInit();
    }

    function setPubHub() external {
        require(pubsHub == address(0), "PubsHub already init");
        pubsHub = msg.sender;
        _hasInit();
    }

    function setCollectPubs() external {
        require(collectPubs == address(0), "CollectPubs already init");
        collectPubs = msg.sender;
        _hasInit();
    }

    function setCVHub() external {
        require(cvHub == address(0), "CVHub already init");
        cvHub = msg.sender;
        _hasInit();
    }

    function setMissionsHub() external {
        require(missionsHub == address(0), "MissionsHub already init");
        missionsHub = msg.sender;
        _hasInit();
    }

    function setFeaturesHub() external {
        require(featuresHub == address(0), "FeaturesHub already init");
        featuresHub = msg.sender;
        _hasInit();
    }

    function setWorkerProposalHub() external {
        require(
            workerProposalHub == address(0),
            "WorkerProposalHub already init"
        );
        workerProposalHub = msg.sender;
        _hasInit();
    }

    function setLaunchpadCohort() external {
        require(launchpadCohort == address(0), "LaunchpadCohort already init");
        launchpadCohort = msg.sender;
        _hasInit();
    }
}
