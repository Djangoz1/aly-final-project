// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import {DataTypes} from "../libraries/DataTypes.sol";
import {IAccessControl} from "../interfaces/IAccessControl.sol";
import {Launchpad} from "../launchpad/Launchpad.sol";
import {ICollectLaunchpadInvestor} from "../interfaces/ICollectLaunchpadInvestor.sol";
import {LaunchpadCohort} from "../cohort/LaunchpadCohort.sol";

contract LaunchpadHub is Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIDs;
    IAccessControl accessControl;
    LaunchpadCohort launchpadCohort;

    ICollectLaunchpadInvestor cLaunchpadInvestor;

    uint8 public maxTiers = 5;

    mapping(uint => address) indexer;

    modifier onlyProxy() {
        require(
            msg.sender == address(accessControl),
            "Must call function with proxy bindings"
        );
        _;
    }

    constructor(address _launchpadCohort) {
        launchpadCohort = LaunchpadCohort(_launchpadCohort);
        accessControl = IAccessControl(launchpadCohort.getAccessControl());
        accessControl.setLaunchpadHub(address(this));
        launchpadCohort.setLaunchpadHub(address(this));
    }

    function setLaunchpadInvestor(
        address _launchpadInvestor
    ) external onlyOwner {
        require(
            _launchpadInvestor != address(0),
            "Must assign a launchpad investor address"
        );
        cLaunchpadInvestor = ICollectLaunchpadInvestor(_launchpadInvestor);
    }

    function getTokensLength() external view returns (uint) {
        return _tokenIDs.current();
    }

    function getLaunchpad(uint _id) external view returns (address) {
        require(_id <= _tokenIDs.current(), "ID out of range");
        return indexer[_id];
    }

    function deployLaunchpad(
        address _owner,
        DataTypes.LaunchpadData memory _datas,
        DataTypes.TierData[] memory _tierDatas
    ) external onlyProxy {
        require(
            bytes(_datas.pubURI).length > 0,
            "Must create pub with information about your project"
        );
        require(
            _datas.saleStart > block.timestamp &&
                _datas.saleStart < _datas.saleEnd,
            "Mismatch timestamp date datas"
        );
        require(_datas.numberOfTier <= maxTiers, "Too many tier numbers");
        _tokenIDs.increment();
        Launchpad newLaunchpad = new Launchpad(
            address(launchpadCohort),
            _owner,
            _tokenIDs.current(),
            _datas,
            _tierDatas
        );
        newLaunchpad.transferOwnership(_owner);
        indexer[_tokenIDs.current()] = address(newLaunchpad);
    }
}
