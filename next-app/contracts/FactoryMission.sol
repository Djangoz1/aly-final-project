// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
// import './CV.sol';

import "./Mission.sol";
import "./SBToken/FactoryCV.sol";
import "./SBToken/CV.sol";

contract FactoryMission is Ownable {
    uint256 public price;
    uint256 public missionsLength;
    uint256 balanceFoundation;
    address public factoryCVAddress;
    FactoryCV factoryCV;
    mapping(address => Mission) public listMission;

    // *::::::::: CONSTRUCTOR :::::::::* //
    constructor(address _factoryCVAddress) payable {
        price = 0.1 ether;
        factoryCVAddress = _factoryCVAddress;
        factoryCV = FactoryCV(factoryCVAddress);
    }

    // *:::::::::: TRANSACTION :::::::::* //
    function withdraw() public onlyOwner {
        payable(owner()).transfer(balanceFoundation);
        balanceFoundation = 0;
    }

    // *::::::::::::: SETTER :::::::::::: //
    function createMission(uint _amount) public returns (address) {
        require(_amount >= price, "Not enough ETH sent; check price!");
        CV cv;
        cv = CV(msg.sender);
        require(cv.isRegistred(), "Not registred");
        uint afterTxFoundation = _amount - price;
        balanceFoundation += price;
        Mission newMission = new Mission(
            afterTxFoundation,
            address(cv),
            factoryCVAddress
        );
        address _address = address(newMission);
        cv.setMission(_address);
        listMission[_address] = newMission;
        missionsLength++;
        return _address;
    }

    // *::::::::::::: GETTER :::::::::::: //
    function getBalance() public view returns (uint) {
        return address(this).balance;
    }

    function getMission(address _address) public view returns (Mission) {
        return listMission[_address];
    }

    function getMissionsLength() public view returns (uint256) {
        return missionsLength;
    }

    function getPrice() public view returns (uint256) {
        return price;
    }

    function setPrice(uint256 _price) public onlyOwner {
        price = _price;
    }
}
