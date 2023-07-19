// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import {DataTypes} from "../libraries/DataTypes.sol";
import {IAccessControl} from "../interfaces/IAccessControl.sol";
import "../launchpad/Launchpad.sol";
// import {ICollectLaunchpadInvestor} from "../interfaces/ICollectLaunchpadInvestor.sol";
import {ILaunchpadCohort} from "../interfaces/ILaunchpadCohort.sol";

contract LaunchpadHub is Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIDs;
    address addrAControl;
    address addrLCohort;
    address addrLInvestor;

    uint8 public maxTiers = 5;

    mapping(uint => address) indexer;

    modifier onlyProxy() {
        require(
            msg.sender == addrAControl,
            "Must call function with proxy bindings"
        );
        _;
    }

    constructor(address _addrLCohort) {
        require(_addrLCohort != address(0), "Must have address");
        addrLCohort = _addrLCohort;
        ILaunchpadCohort iLC = ILaunchpadCohort(_addrLCohort);
        addrAControl = iLC.getAccessControl();
        IAccessControl iAC = IAccessControl(addrAControl);
        iAC.setLaunchpadHub(address(this));
        iLC.setLaunchpadHub(address(this));
    }

    function setLaunchpadInvestor(
        address _launchpadInvestor
    ) external onlyOwner {
        require(
            _launchpadInvestor != address(0),
            "Must assign a launchpad investor address"
        );
        addrLInvestor = _launchpadInvestor;
    }

    function getTokensLength() external view returns (uint) {
        return _tokenIDs.current();
    }

    function getLaunchpad(uint _id) external view returns (address) {
        require(_id <= _tokenIDs.current(), "ID out of range");
        require(indexer[_id] != address(0), "Launchpad not found");
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
            addrLCohort,
            _owner,
            _tokenIDs.current(),
            _datas,
            _tierDatas
        );
        newLaunchpad.transferOwnership(_owner);
        indexer[_tokenIDs.current()] = address(newLaunchpad);
    }
}
