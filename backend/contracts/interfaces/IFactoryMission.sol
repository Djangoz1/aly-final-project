// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

interface IFactoryMission {
    function getFactoryCV() external view returns(address);

    function createMission(uint _amount) external returns (address);

    function getPrice() external view returns (uint256);
}
