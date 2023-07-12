// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import {DataTypes} from "../libraries/DataTypes.sol";
import {Bindings} from "../libraries/Bindings.sol";

import {IAccessControl} from "../interfaces/IAccessControl.sol";

contract PubHub is Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _pubIds;
    /**
     * @dev storage indexer publications
     * @notice key address is for cv publisher
     * @notice array of index publications for each publisher
     */
    mapping(address => uint[]) indexerPub;

    /**
     * @dev storage all publications
     * @notice key uint is for index publication
     * @notice address publication
     */
    mapping(uint => address) pubs;

    IAccessControl accessControl;

    modifier onlyProxy() {
        require(
            msg.sender == address(accessControl),
            "Must call function with proxy bindings"
        );
        _;
    }

    constructor(address _accessControl) {
        accessControl = IAccessControl(_accessControl);
        accessControl.setPubHub(address(this));
    }

    function getFeaturesIds() external view returns (uint) {
        return _pubIds.current();
    }

    /**
     * @param _publisher address is address of cv publisher
     * @return address of publication
     */
    function getIndexerByAddr(
        address _publisher
    ) external view onlyProxy returns (uint[] memory) {
        return indexerPub[_publisher];
    }

    function getPubById(uint _id) external view returns (address) {
        require(_id < _pubIds.current(), "Id is out of range");
        require(pubs[_id] != address(0), "Publication not found");
        return pubs[_id];
    }

    function postPub(
        DataTypes.PubData memory _datas
    ) external onlyProxy returns (address) {
        address newPub = Bindings.deployPub(_datas, _pubIds.current());
        indexerPub[_datas.publisher].push(_pubIds.current());
        pubs[_pubIds.current()] = newPub;
        _pubIds.increment();
        return newPub;
    }
}
