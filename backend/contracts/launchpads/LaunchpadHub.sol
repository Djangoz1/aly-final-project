// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import {DataTypes} from "../libraries/DataTypes.sol";
import {Bindings} from "../libraries/Bindings.sol";

import {IAPIPost} from "../interfaces/system/IAPIPost.sol";
import {IAddressSystem} from "../interfaces/system/IAddressSystem.sol";
import "./Launchpad.sol";
import {ICVsHub} from "../interfaces/cv/ICVsHub.sol";

contract LaunchpadHub is Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIDs;

    IAddressSystem private _iAS;
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
            msg.sender == address(_iAS.apiPost()),
            "Must call function with proxy bindings"
        );
        _;
    }

    constructor(address _addressSystem) {
        _iAS = IAddressSystem(_addressSystem);
        _iAS.setLaunchpadsHub();
        require(
            _iAS.launchpadsHub() == address(this),
            "LaunchpadHub : Error deployment"
        );
    }

    function tokensLength() external view returns (uint) {
        return _tokenIDs.current();
    }

    function launchpadsOfCV(uint _cvID) external view returns (uint[] memory) {
        return indexer[_cvID];
    }

    function addressOf(uint _launchpadID) external view returns (address) {
        require(_launchpadID <= _tokenIDs.current(), "ID out of range");
        require(launchpads[_launchpadID] != address(0), "Launchpad not found");
        return launchpads[_launchpadID];
    }

    function mint(
        uint _cvID,
        DataTypes.LaunchpadData calldata _datas,
        DataTypes.TierData[] calldata _tierDatas,
        uint _pubID
    ) external onlyProxy returns (uint) {
        _tokenIDs.increment();
        address owner = Bindings.ownerOf(_cvID, _iAS.cvsHub());
        Launchpad newLaunchpad = new Launchpad(
            address(_iAS),
            owner,
            _tokenIDs.current(),
            _datas,
            _tierDatas,
            _pubID
        );

        indexer[_cvID].push(_tokenIDs.current());

        newLaunchpad.transferOwnership(owner);
        launchpads[_tokenIDs.current()] = address(newLaunchpad);
        return _tokenIDs.current();
    }
}
