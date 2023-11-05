// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {DataTypes} from "../../libraries/DataTypes.sol";

interface IPubsDatasHub {
    // -------------------------- //
    // ********** LIKE ********** //
    // ********** ---- ********** //

    function buyPub(uint _cvID, uint _pubID) external returns (bool);

    function isAllowed(uint _cvID, uint _pubID) external view returns (bool);

    function mintPayablePub(
        uint _pubID,
        uint _amount,
        string calldata _tokenURI
    ) external returns (bool);

    function datasOfPayablePub(
        uint _pubID
    ) external view returns (DataTypes.PubPayableData memory);

    function indexerOf(uint _id) external view returns (uint[] memory);

    function like(uint _cvID, uint _pubID) external;

    function unlike(uint _cvID, uint _pubID) external;

    // -------------------------- //
    // ****** REFERAL PUBS ****** //
    // ****** ------------ ****** //

    function addPubMission(
        uint _newPubID,
        uint _missionID,
        string memory _tokenURI
    ) external;

    function addPubAnswer(
        uint _newPubID,
        uint _pubID,
        string memory _tokenURI
    ) external;

    function answersOfPub(uint _pubID) external view returns (uint[] memory);

    function dataOf(
        uint _likeID
    ) external view returns (DataTypes.LikeData memory);

    function pubsOfMission(
        uint _missionID
    ) external view returns (uint[] memory);

    function dataOfPub(
        uint _pubID
    ) external view returns (DataTypes.PubData memory);

    // Ajoutez votre code ici
}
