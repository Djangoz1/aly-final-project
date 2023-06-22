// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./CV.sol";
contract FactoryCV is Ownable {
    mapping(address => CV) public listCV;
    uint length;

    function createCV(address _owner) public returns (address) {
        CV newCV = new CV();
        newCV.transferOwnership(_owner);
        listCV[_owner] = newCV;
        length++;
        return address(newCV);
    }

    function getCVsLength() public view returns (uint) {
        return length;
    }

    function getCV(address _address) public view returns (address) {
        return address(listCV[_address]);
    }
}
