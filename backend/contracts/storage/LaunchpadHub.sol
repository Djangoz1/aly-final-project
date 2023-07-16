// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import {DataTypes} from "../libraries/DataTypes.sol";
import {IAccessControl} from "../interfaces/IAccessControl.sol";
import {Launchpad} from "../launchpad/Launchpad.sol";

contract LaunchpadHub is Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIDs;
    IAccessControl accessControl;

    uint8 public maxTiers = 5;

    mapping(uint => address) indexer;

    modifier onlyProxy() {
        require(
            msg.sender == address(accessControl),
            "Must call function with proxy bindings"
        );
        _;
    }

    constructor(address _accessControl) {
        accessControl = IAccessControl(_accessControl);
        accessControl.setLaunchpadHub(address(this));
    }

    function deployLaunchpad(
        address _owner,
        DataTypes.LaunchpadData memory _datas
    ) external onlyProxy {
        require(bytes(_datas.name).length > 0, "Need to specify name");
        require(
            bytes(_datas.pubURI).length > 0,
            "Must create pub with information about your project"
        );
        require(
            _datas.maxCap > 0 &&
                _datas.maxCap > _datas.minCap &&
                _datas.minCap > 0,
            "Mismatch capitalization datas"
        );
        require(
            _datas.saleStart > block.timestamp &&
                _datas.saleStart < _datas.saleEnd,
            "Mismatch timestamp date datas"
        );
        require(_datas.numberOfTier <= maxTiers, "Too many tier numbers");
        _tokenIDs.increment();
        Launchpad newLaunchpad = new Launchpad(
            address(accessControl),
            _tokenIDs.current(),
            _datas
        );
        newLaunchpad.transferOwnership(_owner);
        indexer[_tokenIDs.current()] = address(newLaunchpad);
    }
}
