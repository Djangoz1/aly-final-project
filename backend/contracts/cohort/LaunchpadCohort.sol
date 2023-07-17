// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

import {IAccessControl} from "../interfaces/IAccessControl.sol";
import {DataTypes} from "../libraries/DataTypes.sol";

contract LaunchpadCohort is Ownable {
    address accessControl;
    address launchpadInvestor;
    address launchpadDatas;
    address launchpadHub;

    DataTypes.DeploymentStatus deploymentStatus;

    modifier onlyNotDeploy() {
        require(
            deploymentStatus != DataTypes.DeploymentStatus.Done,
            "Deployment already done"
        );
        _;
    }

    constructor(address _accessControl) {
        IAccessControl AccessControl = IAccessControl(_accessControl);
        AccessControl.setLaunchpadCohort(address(this));
        // require(AccessControl.getLaunchpadCohort() == address(this));
        accessControl = address(AccessControl);
    }

    function setMigrate() external onlyOwner {
        deploymentStatus = DataTypes.DeploymentStatus.Migrate;
    }

    function hasInit() internal {
        if (
            accessControl != address(0) &&
            launchpadDatas != address(0) &&
            launchpadInvestor != address(0) &&
            launchpadHub != address(0)
        ) {
            deploymentStatus = DataTypes.DeploymentStatus.Done;
        }
    }

    function getAccessControl() external view returns (address) {
        return accessControl;
    }

    // *::::::::::: -------- :::::::::::* //
    // *::::::::::: INVESTOR :::::::::::* //
    // *::::::::::: -------- :::::::::::* //
    function setLaunchpadInvestor(address _cLI) external onlyNotDeploy {
        launchpadInvestor = _cLI;
        hasInit();
    }

    function getAddrCollectInvestor() external view returns (address) {
        return launchpadInvestor;
    }

    // *::::::::::: ----- :::::::::::* //
    // *::::::::::: DATAS :::::::::::* //
    // *::::::::::: ----- :::::::::::* //
    function setLaunchpadDatas(address _cLD) external onlyNotDeploy {
        launchpadDatas = _cLD;
        hasInit();
    }

    function getAddrCollectDatas() external view returns (address) {
        return launchpadDatas;
    }

    // *::::::::::: --- :::::::::::* //
    // *::::::::::: HUB :::::::::::* //
    // *::::::::::: --- :::::::::::* //
    function setLaunchpadHub(address _LH) external onlyNotDeploy {
        launchpadHub = _LH;
        hasInit();
    }

    function getAddrLaunchpadHub() external view returns (address) {
        return launchpadHub;
    }
}
