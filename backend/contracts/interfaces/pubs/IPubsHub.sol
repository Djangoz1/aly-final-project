// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

interface IPubsHub {
    function tokensLength() external view returns (uint);

    function indexerOf(uint _cvID) external view returns (uint[] memory);

    function mint(
        uint _cvID,
        string calldata _tokenURI
    ) external returns (uint);

    function likePub(uint _cvID, uint _id) external;

    function unlikePub(uint _cvID, uint _id) external;
}
