// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

interface ICollectLikePub {
    function getTokenLength() external view returns (uint);

    function getIndexer(uint _id) external view returns (uint[] memory);

    function mint(address _cv, uint _id) external;

    function burn(address _owner, uint _likeID) external;

    // Ajoutez votre code ici
}
