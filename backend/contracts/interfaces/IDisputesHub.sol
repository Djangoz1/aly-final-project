// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

import {DataTypes} from "../libraries/DataTypes.sol";
import {IAccessControl} from "../interfaces/IAccessControl.sol";

interface IDisputesHub {
    function MIN_RECLAMATION_PERIOD() external view returns (uint256);

    function MAX_RECLAMATION_PERIOD() external view returns (uint256);

    function addrAH() external view returns (address);

    function getTokensLength() external view returns (uint);

    function mint(
        address _to,
        uint256 _featureID,
        DataTypes.CourtIDs _courtID,
        uint32 _reclamationPeriod,
        uint8 _nbArbitrators,
        string memory _tokenURI
    ) external returns (bool);

    function addressOf(uint _disputeID) external view returns (address);
}
