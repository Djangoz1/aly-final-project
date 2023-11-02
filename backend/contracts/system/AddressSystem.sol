// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import {DataTypes} from "../libraries/DataTypes.sol";

import {IAccessControl} from "../interfaces/system/IAccessControl.sol";

contract AddressSystem is Ownable {
    address public apiPost;
    address public apiPostPayable;
    address public apiGet;
    address public accessControl;
    address public missionsHub;
    address public factory;
    address public balancesHub;
    address public featuresHub;
    address public collectWorkInteraction;
    address public disputesHub;
    address public arbitratorsHub;
    address public workProposalHub;
    address public disputesDatasHub;

    address public cvsDatasHub;
    address public cvsHub;

    address public pubsHub;

    address public pubsDatasHub;

    address public launchpadsDatasHub;
    address public launchpadsInvestorsHub;
    address public launchpadsHub;

    function _hasInit() internal {
        if (
            apiPost != address(0) &&
            apiPostPayable != address(0) &&
            apiGet != address(0) &&
            accessControl != address(0) &&
            arbitratorsHub != address(0) &&
            balancesHub != address(0) &&
            collectWorkInteraction != address(0) &&
            disputesHub != address(0) &&
            missionsHub != address(0) &&
            cvsDatasHub != address(0) &&
            cvsHub != address(0) &&
            featuresHub != address(0) &&
            workProposalHub != address(0) &&
            factory != address(0) &&
            disputesDatasHub != address(0) &&
            pubsHub != address(0) &&
            pubsDatasHub != address(0) &&
            launchpadsHub != address(0) &&
            launchpadsDatasHub != address(0) &&
            launchpadsInvestorsHub != address(0)
        ) {
            IAccessControl iAC = IAccessControl(accessControl);
            iAC.initWorkflow();
        }
    }

    // -------------------------------- //
    // ********** LAUNCHPADS ********** //
    // ********** ---------- ********** //
    function setLaunchpadsDatasHub() external {
        require(
            launchpadsDatasHub == address(0),
            "LaunchpadsDatasHub already init"
        );
        launchpadsDatasHub = msg.sender;
        _hasInit();
    }

    function setLaunchpadsInvestorsHub() external {
        require(
            launchpadsInvestorsHub == address(0),
            "LaunchpadsInvestorsHub already init"
        );
        launchpadsInvestorsHub = msg.sender;
        _hasInit();
    }

    function setLaunchpadsHub() external {
        require(launchpadsHub == address(0), "LaunchpadsHub already init");
        launchpadsHub = msg.sender;
        _hasInit();
    }

    // -------------------------------- //
    // ************* WORKS ************ //
    // ************* ----- ************ //
    function setCollectWorkInteraction() external {
        require(
            collectWorkInteraction == address(0),
            "CollectWorkInteraction already init"
        );
        collectWorkInteraction = msg.sender;
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

    function setWorkProposalHub() external {
        require(workProposalHub == address(0), "workProposalHub already init");
        workProposalHub = msg.sender;
        _hasInit();
    }

    // -------------------------------- //
    // ************ ESCROW ************ //
    // ************ ------ ************ //
    function setArbitratorsHub() external {
        require(arbitratorsHub == address(0), "ArbitratorsHub already init");
        arbitratorsHub = msg.sender;
        _hasInit();
    }

    function setDisputesHub() external {
        require(disputesHub == address(0), "DisputesHub already init");
        disputesHub = msg.sender;
        _hasInit();
    }

    function setDisputesDatasHub() external {
        require(
            disputesDatasHub == address(0),
            "DisputesDatasHub already init"
        );
        disputesDatasHub = msg.sender;
        _hasInit();
    }

    // -------------------------------- //
    // ************ SYSTEM ************ //
    // ************ ------ ************ //
    function setApiPost() external {
        require(apiPost == address(0), "APIPost already init");
        apiPost = msg.sender;
        _hasInit();
    }

    function setApiPostPayable() external {
        require(apiPostPayable == address(0), "APIPostPayable already init");
        apiPostPayable = msg.sender;
        _hasInit();
    }

    function setApiGet() external {
        require(apiGet == address(0), "APIGet already init");
        apiGet = msg.sender;
        _hasInit();
    }

    function setFactory() external {
        require(factory == address(0), "Factory already init");
        factory = msg.sender;
        _hasInit();
    }

    function setBalancesHub() external {
        require(balancesHub == address(0), "BalancesHub already init");
        balancesHub = msg.sender;
        _hasInit();
    }

    function setAccessControl() external {
        require(accessControl == address(0), "AccessControl already init");
        accessControl = msg.sender;
        _hasInit();
    }

    // -------------------------------- //
    // ************** CV ************** //
    // ************** -- ************** //

    function setCVsDatasHub() external {
        require(cvsDatasHub == address(0), "CVsDatasHub already init");
        cvsDatasHub = msg.sender;
        _hasInit();
    }

    function setCVsHub() external {
        require(cvsHub == address(0), "CVsHub already init");
        cvsHub = msg.sender;
        _hasInit();
    }

    // -------------------------------- //
    // ************* PUBS ************* //
    // ************* ---- ************* //

    function setPubHub() external {
        require(pubsHub == address(0), "PubsHub already init");
        pubsHub = msg.sender;
        _hasInit();
    }

    function setPubsDatasHub() external {
        require(pubsDatasHub == address(0), "pubsDatasHub already init");
        pubsDatasHub = msg.sender;
        _hasInit();
    }
}
