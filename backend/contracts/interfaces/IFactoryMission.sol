// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

interface IFactoryMission {
    function getFactoryCV() external view returns (address);

    function createMission(address _for) external;

    function getIndexers(address _for) external view returns (uint[] memory);

    function getPrice() external view returns (uint256);
}
