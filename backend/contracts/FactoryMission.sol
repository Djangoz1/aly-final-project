// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "./Mission.sol";
import "./SBToken/FactoryCV.sol";
import "./SBToken/CV.sol";

import {IAccessControl} from "./interfaces/IAccessControl.sol";

contract FactoryMission is Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _missionIds;

    IAccessControl accessControl;

    mapping(address => uint[]) listIndexers;
    mapping(uint => address) public listMissions;

    modifier onlyProxy() {
        require(
            msg.sender == address(accessControl),
            "Must call function with proxy bindings"
        );
        _;
    }

    // *::::::::::::: ----------- ::::::::::::* //
    // *::::::::::::: CONSTRUCTOR ::::::::::::* //
    // *::::::::::::: ----------- ::::::::::::* //

    constructor(address _factoryCV, address _accessControl) payable {
        accessControl = IAccessControl(_accessControl);
        accessControl.setFactoryMission(address(this));
    }

    function checkRegistred(uint _id) external view {
        require(listMissions[_id] != address(0), "Mission not found");
    }

    // *::::::::::::: ------ ::::::::::::* //
    // *::::::::::::: SETTER ::::::::::::* //
    // *::::::::::::: ------ ::::::::::::* //

    function createMission(address _for) external onlyProxy {
        Mission newMission = new Mission(_for, _missionIds.current());

        listIndexers[_for].push(_missionIds.current());
        listMissions[_missionIds.current()] = address(newMission);
        _missionIds.increment();
    }

    // *::::::::::::: ------ ::::::::::::* //
    // *::::::::::::: GETTER ::::::::::::* //
    // *::::::::::::: ------ ::::::::::::* //

    /**
     * @param _for is cv address
     * @return [] of missionIds
     */

    function getIndexers(
        address _for
    ) external view onlyProxy returns (uint[] memory) {
        require(listIndexers[_for].length > 0, "No missions index found");
        return listIndexers[_for];
    }

    function getMission(uint _id) external view onlyProxy returns (address) {
        require(_id < _missionIds.current(), "Mission does not exist");
        return listMissions[_id];
    }

    function getMissionIds() external view returns (uint256) {
        return _missionIds.current();
    }
}
