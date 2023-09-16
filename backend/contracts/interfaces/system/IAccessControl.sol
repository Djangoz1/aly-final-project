// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

interface IAccessControl {
    function initWorkflow() external;

    function hasRegistred(address _forCheck) external pure;

    function getPubIndexers(
        address _addr
    ) external view returns (uint[] memory);
}
