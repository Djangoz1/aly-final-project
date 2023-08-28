// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

import {IAccessControl} from "../interfaces/IAccessControl.sol";
import {DataTypes} from "../libraries/DataTypes.sol";

// import {ILaunchpadCohort} from "./interfaces/ILaunchpadCohort.sol";
// import {ILaunchpadHub} from "./interfaces/ILaunchpadHub.sol";
// import {IWorkerProposalHub} from "./interfaces/IWorkerProposalHub.sol";
// import {IPubsHub} from "./interfaces/IPubsHub.sol";
// import {ICVHub} from "./interfaces/ICVHub.sol";
// import {ICV} from "./interfaces/ICV.sol";
// import {ICollectLikePub} from "./interfaces/ICollectLikePub.sol";

contract AddressHub is Ownable {
    address public accessControl;
    address public missionsHub;
    address public disputesHub;
    address public arbitratorsHub;
    address public cvHub;
    address public pubsHub;
    address public featuresHub;
    address public workerProposalHub;
    address public launchpadCohort;

    function _hasInit() internal {
        if (
            accessControl != address(0) &&
            arbitratorsHub != address(0) &&
            disputesHub != address(0) &&
            missionsHub != address(0) &&
            cvHub != address(0) &&
            pubsHub != address(0) &&
            featuresHub != address(0) &&
            workerProposalHub != address(0) &&
            launchpadCohort != address(0)
        ) {
            IAccessControl iAC = IAccessControl(accessControl);
            iAC.initWorkflow();
        }
    }

    function setAccessControl(address _accessControl) external {
        accessControl = _accessControl;
        _hasInit();
    }

    function setArbitratorsHub(address _arbitratorsHub) external {
        arbitratorsHub = _arbitratorsHub;
        _hasInit();
    }

    function setDisputesHub(address _disputesHub) external {
        disputesHub = _disputesHub;
        _hasInit();
    }

    function setPubHub(address _pubHub) external {
        pubsHub = _pubHub;
        _hasInit();
    }

    function setCVHub(address _CVHub) external {
        cvHub = _CVHub;
        _hasInit();
    }

    function setMissionsHub(address _missionsHub) external {
        missionsHub = _missionsHub;
        _hasInit();
    }

    function setFeaturesHub(address _featuresHub) external {
        featuresHub = _featuresHub;
        _hasInit();
    }

    function setWorkerProposalHub(address _workerProposalHub) external {
        workerProposalHub = _workerProposalHub;
        _hasInit();
    }

    function setLaunchpadCohort(address _launchpadCohort) external {
        require(_launchpadCohort != address(0), "Must set a valid address");
        launchpadCohort = _launchpadCohort;
        _hasInit();
    }
}
