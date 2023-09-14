// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

interface ICollectPubs {
    function addPubMission(uint _newPubID, uint _missionID, string memory _tokenURI) external;

    function addPubAnswer(
        uint _newPubID,
        uint _pubID,
        string memory _tokenURI
    ) external;

    function getPubAnswers(uint _pubID) external view returns (uint[] memory);

    function getPubsMission(
        uint _missionID
    ) external view returns (uint[] memory);
}
