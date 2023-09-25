// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

interface IContract {
    function tokensLength() external view returns (uint);

    function indexerOf(uint _tokenID) external view returns (uint[] memory);

    // Ajoutez votre code ici

    function setTokenURI(
        address _owner,
        uint _tokenID,
        string calldata _tokenURI
    ) external;
}
