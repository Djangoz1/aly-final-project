// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {DataTypes} from "../../libraries/DataTypes.sol";

interface IDisputesHub {
    function MIN_RECLAMATION_PERIOD() external view returns (uint256);

    function MAX_RECLAMATION_PERIOD() external view returns (uint256);

    function addrAH() external view returns (address);

    function tokensLength() external view returns (uint);

    function mint(
        address _to,
        uint256 _featureID,
        DataTypes.CourtIDs _courtID,
        uint32 _reclamationPeriod,
        uint8 _nbArbitrators,
        string memory _tokenURI
    ) external returns (bool);

    function addressOf(uint _disputeID) external view returns (address);

    function disputeOf(uint _featureID) external view returns (uint);
}
