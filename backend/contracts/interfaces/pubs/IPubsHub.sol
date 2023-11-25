// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

interface IPubsHub {
    function tokensLength() external view returns (uint);

    function indexerOf(uint _cvID) external view returns (uint[] memory);

    function mint(
        uint _cvID,
        string calldata _tokenURI,
        bool _isPayable
    ) external returns (uint);

    function indexerPayableOf(uint _cvID) external view returns (uint[] memory);
}
