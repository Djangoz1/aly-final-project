// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {LibChallenge} from "../../libraries/challenges/LibChallenge.sol";

interface IChallengersHub {
    // Ajoutez votre code ici
    function datasOf(
        uint _challengeID
    ) external view returns (LibChallenge.ChallengerDatas memory);

    function ownerOf(uint _challengeID) external view returns (address);

    function indexerOf(uint _cvID) external view returns (uint[] memory);

    function incrementVote(uint _challengerID) external;

    // La fonction resolveChallenge doit être conçue de manière à vérifier la solution
    // Peut-être via un oracle ou une méthode de validation manuelle
    function tryResolveChallenge(
        uint _cvID,
        uint _challengeID,
        string memory _tokenURI
    ) external returns (uint);
    // Autres fonctions nécessaires...
}
