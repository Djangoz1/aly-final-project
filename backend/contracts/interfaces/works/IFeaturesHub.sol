// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {DataTypes} from "../../libraries/DataTypes.sol";

interface IFeaturesHub {
    // Ajoutez votre code ici
    function addrCWI() external view returns (address);

    function getaddressSystem() external view returns (address);

    function tokensLength() external view returns (uint);

    function mint(
        address _owner,
        uint _missionID,
        uint _wadge,
        uint16 _estimatedDays,
        bool _isInviteOnly,
        string memory _tokenURI,
        DataTypes.CourtIDs _specification,
        bool _payWithToken
    ) external returns (uint);

    function dataOf(
        uint _id
    ) external view returns (DataTypes.FeatureData memory _data);

    function setFeature(
        uint _featureID,
        DataTypes.FeatureData memory _data
    ) external returns (bool);

    function ownerOf(uint256 tokenId) external view returns (address owner);

    function indexerOf(uint _cvID) external view returns (uint[] memory);

    function validFeature(address _sender, uint _featureID) external;

    function tokenURI(uint tokenId) external view returns (string memory);

    function resolvedDispute(
        uint _cvID,
        uint _featureID
    ) external payable returns (bool);
}
