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

    address private addrLCohort;

    uint8 public maxTiers = 5;

    mapping(uint => address) private launchpads;
    mapping(address => uint[]) private indexer;

    modifier onlyProxy() {
        require(
            msg.sender == ILaunchpadCohort(addrLCohort).getAccessControl(),
            "Must call function with proxy bindings"
        );
        _;
    }

    constructor(address _addrLCohort) {
        require(_addrLCohort != address(0), "Must have address");
        addrLCohort = _addrLCohort;

        IAccessControl iAC = accessControl();
        iAC.setLaunchpadHub(address(this));
    }

    function accessControl() private view returns (IAccessControl) {
        return IAccessControl(ILaunchpadCohort(addrLCohort).getAccessControl());
    }

    function getTokensLength() external view returns (uint) {
        return _tokenIDs.current();
    }

    function ownerOf(address _cv) external view returns (uint[] memory) {
        return indexer[_cv];
    }

    function getLaunchpad(uint _id) external view returns (address) {
        require(_id <= _tokenIDs.current(), "ID out of range");
        require(launchpads[_id] != address(0), "Launchpad not found");
        return launchpads[_id];
    }

    function deployLaunchpad(
        address _owner,
        DataTypes.LaunchpadData calldata _datas,
        DataTypes.TierData[] calldata _tierDatas
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
        IAccessControl iAC = accessControl();
        address cv = iAC.getCVByAddress(_owner);
        indexer[cv].push(_tokenIDs.current());

        newLaunchpad.transferOwnership(_owner);
        launchpads[_tokenIDs.current()] = address(newLaunchpad);
    }
}
