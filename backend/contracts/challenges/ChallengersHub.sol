// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import {IAddressSystem} from "../interfaces/system/IAddressSystem.sol";
import {IArbitratorsHub} from "../interfaces/escrow/IArbitratorsHub.sol";
import {LibChallenge} from "../libraries/challenges/LibChallenge.sol";

import {Bindings} from "../libraries/Bindings.sol";
import {DataTypes} from "../libraries/DataTypes.sol";

contract ChallengersHub is Ownable {
    // Ajoutez votre code ici
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIDs;
    mapping(uint => LibChallenge.ChallengerDatas) challengers;
    mapping(uint => address) public ownerOf;

    /**
     *   @notice cvID => challengeID
     */
    mapping(uint => uint[]) commitsOfCVs;

    IAddressSystem private _iAS;

    modifier onlyProxy() {
        require(
            msg.sender == _iAS.apiPostPayable() || msg.sender == _iAS.apiPost(),
            "Must call function with proxy bindings"
        );
        _;
    }

    constructor(address _addressSystem) {
        _iAS = IAddressSystem(_addressSystem);
        _iAS.setChallengersHub();
        require(_iAS.challengersHub() == address(this), "Deployment failed");
    }

    function indexerOf(uint _cvID) external view returns (uint[] memory) {
        commitsOfCVs[_cvID];
    }

    function datasOf(
        uint _challengerID
    ) external view returns (LibChallenge.ChallengerDatas memory) {
        return challengers[_challengerID];
    }

    function incrementVote(uint _challengerID) external {
        challengers[_challengerID].votes++;
    }

    // La fonction resolveChallenge doit être conçue de manière à vérifier la solution
    // Peut-être via un oracle ou une méthode de validation manuelle
    function tryResolveChallenge(
        uint _cvID,
        uint _challengeID,
        string memory _tokenURI
    ) external onlyProxy returns (uint) {
        LibChallenge.ChallengerDatas memory datas;
        datas.challengeID = _challengeID;
        datas.tokenURI = _tokenURI;
        uint challengerID = _tokenIDs.current();
        challengers[challengerID] = datas;
        commitsOfCVs[_cvID].push(_challengeID);
        return challengerID;
    }

    // Autres fonctions nécessaires...
}
