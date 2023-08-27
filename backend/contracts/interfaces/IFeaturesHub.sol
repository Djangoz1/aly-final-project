// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import {DataTypes} from "../libraries/DataTypes.sol";

// import {IAccessControl} from "../interfaces/IAccessControl.sol";

interface IFeaturesHub {
    // Ajoutez votre code ici

    function getAddressHub() external view returns (address);

    function mint(
        address _owner,
        uint _missionID,
        uint _wadge,
        uint16 _estimatedDays,
        bool _isInviteOnly,
        string memory _tokenURI
    ) external returns (uint);

    function getData(
        uint _id
    ) external view returns (DataTypes.FeatureData memory _data);

    function setFeature(
        uint _featureID,
        DataTypes.FeatureData memory _data
    ) external returns (bool);

    function ownerOf(uint256 tokenId) external view returns (address owner);
}
