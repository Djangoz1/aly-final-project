// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./CV.sol";

contract FactoryCV is Ownable {
    mapping(address => address) public listCV;
    uint length;

    function createCV(address _owner) public returns (address) {
        require(listCV[_owner] == address(0), "Can't have more than 1");
        CV newCV = new CV();
        newCV.transferOwnership(_owner);
        listCV[_owner] = address(newCV);
        length++;
        return address(newCV);
    }

    function getCVsLength() public view returns (uint) {
        return length;
    }

    function getCV(address _address) public view returns (address) {
        CV cv = CV(listCV[_address]);
        require(cv.isRegistred(), "CV not found");
        return address(listCV[_address]);
    }
}
