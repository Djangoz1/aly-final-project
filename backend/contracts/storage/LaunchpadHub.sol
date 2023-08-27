// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import {DataTypes} from "../libraries/DataTypes.sol";
import {IAccessControl} from "../interfaces/IAccessControl.sol";
import {IAddressHub} from "../interfaces/IAddressHub.sol";
import {ICVHub} from "../interfaces/ICVHub.sol";
import "../launchpad/Launchpad.sol";
// import {ICollectLaunchpadInvestor} from "../interfaces/ICollectLaunchpadInvestor.sol";
import {ILaunchpadCohort} from "../interfaces/ILaunchpadCohort.sol";

contract LaunchpadHub is Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIDs;

    address private addrLCohort;
    address private addrAccessControl;

    uint8 public maxTiers = 5;

    /**
     * @dev This is the mapping of the launchpads address to the token ID
     * @dev uint param is for token ID
     * @dev return address is for launchpad address
     */

    mapping(uint => address) private launchpads;
    /**
     * @dev This is the mapping of the launchpads for cv ID
     * @dev uint param is for CV ID
     * @dev return uint[] for launchpad IDs
     */
    mapping(uint => uint[]) private indexer;

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
        ILaunchpadCohort iLC = ILaunchpadCohort(_addrLCohort);
        addrAccessControl = iLC.getAccessControl();
        iLC.setLaunchpadHub(address(this));
    }

    function accessControl() private view returns (IAccessControl) {
        return IAccessControl(ILaunchpadCohort(addrLCohort).getAccessControl());
    }

    function getTokensLength() external view returns (uint) {
        return _tokenIDs.current();
    }

    function getLaunchpads(uint _cvID) external view returns (uint[] memory) {
        return indexer[_cvID];
    }

    function getLaunchpad(uint _id) external view returns (address) {
        require(_id <= _tokenIDs.current(), "ID out of range");
        require(launchpads[_id] != address(0), "Launchpad not found");
        return launchpads[_id];
    }

    function mint(
        address _owner,
        DataTypes.LaunchpadData calldata _datas,
        DataTypes.TierData[] calldata _tierDatas,
        string memory _pubURI
    ) external onlyProxy returns(uint) {
        require(bytes(_pubURI).length > 0, "Must have pub URI");
        
        // require(_datas.tokenAddress != address(0), "Must have token address");
        _tokenIDs.increment();

        Launchpad newLaunchpad = new Launchpad(
            addrLCohort,
            _owner,
            _tokenIDs.current(),
            _datas,
            _tierDatas,
            _pubURI
        );
        ILaunchpadCohort iLC = ILaunchpadCohort(addrLCohort);
        IAddressHub iAH = IAddressHub(iLC.addressHub());

        ICVHub iCVH = ICVHub(iAH.cvHub());
        uint cvID = iCVH.getCV(_owner);
        indexer[cvID].push(_tokenIDs.current());

        newLaunchpad.transferOwnership(_owner);
        launchpads[_tokenIDs.current()] = address(newLaunchpad);
        return _tokenIDs.current();
    }
}
