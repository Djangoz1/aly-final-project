// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {LibChallenge} from "../../libraries/challenges/LibChallenge.sol";
import {DataTypes} from "../../libraries/DataTypes.sol";

interface IChallengesHub {
    // Ajoutez votre code ici
    function timeLocked() external view returns (uint);

    function minTimelapse() external view returns (uint);

    function challenges(
        uint _challengeID
    ) external view returns (LibChallenge.ChallengeDatas memory);

    function addressOf(uint _challengeID) external view returns (address);

    function challengesOfCourt(
        DataTypes.CourtIDs _courtID
    ) external view returns (uint[] memory);

    function challengersOf(
        uint _challengeID,
        uint _cvID
    ) external view returns (uint);

    function createChallenge(
        uint _ownerID,
        DataTypes.CourtIDs _courtID,
        string memory _tokenURI,
        uint _timelapse,
        uint _value
    ) external;

    function tryResolveChallenge(
        uint _cvID,
        uint _challengeID,
        string memory _tokenURI
    ) external;

    function arbitreChallenge(
        uint _cvArbitratorID,
        uint _cvChallengerID,
        uint _challengeID
    ) external;

    // Autres fonctions nécessaires...
}
