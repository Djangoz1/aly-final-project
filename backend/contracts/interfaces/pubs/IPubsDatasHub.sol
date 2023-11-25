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

    // -------------------------- //
    // ****** REFERAL PUBS ****** //
    // ****** ------------ ****** //

    function dataOfPub(
        uint _pubID
    ) external view returns (DataTypes.PubData memory);

    // Ajoutez votre code ici
}
