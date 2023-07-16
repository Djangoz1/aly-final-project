// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {DataTypes} from "../libraries/DataTypes.sol";

interface IAccessControl {
    function hasRegistred(address _forCheck) external pure;

    function setPubHub(address _pubHub) external;

    function getPubHub() external view returns (address);

    function setFactoryCV(address _factoryCV) external;

    function getFactoryCV() external view returns (address);

    function setFeaturesHub(address _featuresHub) external;

    function getFeaturesHub() external view returns (address);

    function setMissionsHub(address _missionsHub) external;

    function getMissionsHub() external view returns (address);

    function getWorkerProposalHub() external view returns (address);

    function setWorkerProposalHub(address _workerProposalHub) external;

    function setLaunchpadHub(address _launchpadHub) external;

    function getLaunchpadHub() external view returns (address);

    function buyCV() external returns (address);

    function getCVByAddress(address _addr) external view returns (address);

    function getPubIndexers(
        address _addr
    ) external view returns (uint[] memory);
}
