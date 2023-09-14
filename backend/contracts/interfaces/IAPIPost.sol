// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

interface IAPIPost {
    function sendTransaction(
        address _to,
        uint _value
    ) external payable returns (bool);

    function createPub(
        uint _cvID,
        string calldata _tokenURI
    ) external returns (uint);
}
