// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

interface IWorkerProposalHub {
    function postWorkerProposal(
        address _cv,
        string calldata _tokenURI,
        uint _featureId
    ) external returns (uint);

    function indexerOf(address _forCV) external view returns (uint[] memory);

    function getProposal(uint _id) external view returns (address);
}
