// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

import {InteractionLogic} from "../libraries/InteractionLogic.sol";

import {DataTypes} from "../libraries/DataTypes.sol";
import {Bindings} from "../libraries/Bindings.sol";

import {IAPIPost} from "../interfaces/system/IAPIPost.sol";
import {IAddressSystem} from "../interfaces/system/IAddressSystem.sol";
import {ILaunchpadsDatasHub} from "../interfaces/launchpads/ILaunchpadsDatasHub.sol";
import "./Launchpad.sol";
import {ICVsHub} from "../interfaces/cv/ICVsHub.sol";

contract LaunchpadHub is Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIDs;
    // using SafeMath for uint256;

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
            msg.sender == address(_iAS.apiPost()) ||
                msg.sender == address(_iAS.apiPostPayable()),
            "Must call function with proxy bindings"
        );
        _;
    }

    constructor(address _addressSystem) {
        _iAS = IAddressSystem(_addressSystem);
        _iAS.setLaunchpadsHub();
        require(
            _iAS.launchpadsHub() == address(this),
            "LaunchpadHub: Error deployment"
        );
    }

    function tokensLength() external view returns (uint) {
        return _tokenIDs.current();
    }

    function indexerOf(uint _cvID) external view returns (uint[] memory) {
        return indexer[_cvID];
    }

    function idOf(address _launchpad) external view returns (uint) {
        return Launchpad(_launchpad).id();
    }

    // function balanceOf(address _owner) external view returns (uint) {
    //     uint _cvID = Bindings.cvOf(_owner, _iAS.cvsHub());
    //     return indexer[_cvID].length;
    // }

    function addressOf(uint _launchpadID) external view returns (address) {
        require(
            _launchpadID <= _tokenIDs.current() &&
                launchpads[_launchpadID] != address(0),
            "LaunchpadHub: Error ID"
        );
        return launchpads[_launchpadID];
    }

    function ownerOf(uint _launchpadID) external view returns (address) {
        require(
            _launchpadID > 0 && _launchpadID <= _tokenIDs.current(),
            "ID out of range"
        );
        return Launchpad(launchpads[_launchpadID]).owner();
    }

    function mint(
        uint _cvID,
        DataTypes.LaunchpadData memory _datas
    ) external onlyProxy returns (uint) {
        _tokenIDs.increment();
        address owner = Bindings.ownerOf(_cvID, _iAS.cvsHub());
        uint newLaunchpadID = _tokenIDs.current();
        bool success = InteractionLogic._checkLaunchpadData(_datas);
        require(success, "Error launchpad datas");

        // require(_datas.tokenAddress != address(0), "Invalid address");
        // uint256[] memory _maxTierCaps = new uint256[](_tierDatas.length);
        // uint256[] memory _minTierCaps = new uint256[](_tierDatas.length);
        // uint256[] memory _tokenPrice = new uint256[](_tierDatas.length);

        // for (uint256 index = 0; index < _tierDatas.length; index++) {
        //     DataTypes.TierData memory _tierData = _tierDatas[index];
        //     _maxTierCaps[index] = _tierData.maxTierCap;
        //     _minTierCaps[index] = _tierData.minTierCap;
        //     _tokenPrice[index] = _tierData.tokenPrice;
        //     _datas.maxCap = _datas.maxCap.add(_tierData.maxTierCap);
        //     _datas.minCap = _datas.minCap.add(_tierData.minTierCap);
        //     require(
        //         _tierData.tokenPrice < _datas.maxCap &&
        //             _tierData.tokenPrice < _datas.maxInvest &&
        //             _datas.minInvest <= _tierData.maxTierCap,
        //         "LaunchpadHub: Missmatch value"
        //     );
        // }

        // _datas.numberOfTier = uint8(_tierDatas.length);

        Launchpad newLaunchpad = new Launchpad(
            address(_iAS),
            owner,
            newLaunchpadID
            // _datas.tokenAddress
        );
        indexer[_cvID].push(newLaunchpadID);
        launchpads[newLaunchpadID] = address(newLaunchpad);

        // cLD._setTiers(
        //     _tierDatas.length,
        //     newLaunchpadID,
        //     _maxTierCaps,
        //     _minTierCaps,
        //     _tokenPrice
        // );
        return newLaunchpadID;
    }
}
