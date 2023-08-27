// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

interface ILaunchpadCohort {
    function accessControl() external view returns (address);

    function addressHub() external view returns (address);

    function launchpadHub() external view returns (address);

    function getAccessControl() external view returns (address);

    function deployLaunchpadHub() external;

    function deployCollectDatas() external;

    function deployCollectInvestor() external;

    function getAddrCollectInvestor() external view returns (address);

    function getAddrCollectDatas() external view returns (address);

    function getAddrLaunchpadHub() external view returns (address);

    function setLaunchpadHub(address _LH) external;
}
