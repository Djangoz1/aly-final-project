// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

import "./Mission.sol";
import "./SBToken/FactoryCV.sol";
import "./SBToken/CV.sol";

contract FactoryMission is Ownable {
    uint256 public price;
    uint256 public missionsLength;
    uint256 balanceFoundation;
    address public factoryCV;
    
    mapping(uint => Mission) public listMission;

    // *::::::::: CONSTRUCTOR :::::::::* //
    constructor(address _factoryCV) payable {
        price = 0.1 ether;
        factoryCV = _factoryCV;
    }

    // *:::::::::::: -------- ::::::::::::* //
    function getFactoryCV() external view returns(address) {
        return factoryCV;
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
            factoryCV
        );
        address _address = address(newMission);
        cv.setMission(_address);

        listMission[missionsLength] = newMission;
        missionsLength++;
        return _address;
    }

    // *::::::::::::: GETTER :::::::::::: //
    function getBalance() public view returns (uint) {
        return address(this).balance;
    }

    function getMission(uint _id) public view returns (Mission) {
        require(_id < missionsLength, "Mission does not exist");
        return listMission[_id];
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
