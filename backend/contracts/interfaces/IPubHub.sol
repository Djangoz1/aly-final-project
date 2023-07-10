// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {DataTypes} from "../libraries/DataTypes.sol";

// import {} from "./interfaces/..sol";

interface IPubHub {
    function getLength() external view returns (uint);

    function getIndexerByAddr(
        address _publisher
    ) external view returns (uint[] memory);

    function getPubById(uint _id) external view returns (address);

    function postPub(
        DataTypes.PubData memory _datas
    ) external returns (address);
}
