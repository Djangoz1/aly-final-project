// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import {IAddressSystem} from "../interfaces/system/IAddressSystem.sol";
import {IArbitratorsHub} from "../interfaces/escrow/IArbitratorsHub.sol";
import {IChallengersHub} from "../interfaces/challenges/IChallengersHub.sol";

import {Bindings} from "../libraries/Bindings.sol";
import {DataTypes} from "../libraries/DataTypes.sol";
import {LibChallenge} from "../libraries/challenges/LibChallenge.sol";

contract ChallengesHub is Ownable {
    // Ajoutez votre code ici
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIDs;
    uint public constant timeLocked = 180 days;
    uint public constant minTimelapse = 7 days;

    mapping(uint => LibChallenge.ChallengeDatas) public challenges;
    mapping(uint => address) public ownerOf;
    mapping(DataTypes.CourtIDs => uint[]) public challengesOfCourt;
    mapping(uint => mapping(uint => uint)) challengersOf;
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
        _iAS.setChallengesHub();
        require(_iAS.challengesHub() == address(this), "Deployment failed");
    }

    function createChallenge(
        uint _ownerID,
        DataTypes.CourtIDs _courtID,
        string memory _tokenURI,
        uint _timelapse,
        uint _value
    ) external onlyProxy {
        IArbitratorsHub _iAH = IArbitratorsHub(_iAS.arbitratorsHub());
        require(
            _value > 0 &&
                _iAH.lengthOfCourt(_courtID) > 3 &&
                _timelapse >= minTimelapse &&
                Bindings.tokensLength(_iAS.cvsHub()) <= _ownerID &&
                bytes(_tokenURI).length > 3 &&
                _courtID != DataTypes.CourtIDs.Centralized &&
                _courtID != DataTypes.CourtIDs.Kleros,
            "ChallengesHub: BAD_DATAS"
        );

        uint challengeID = _tokenIDs.current();
        _tokenIDs.increment();
        LibChallenge.ChallengeDatas memory newChallenge;
        newChallenge.tokenURI = _tokenURI;
        newChallenge.reward = _value;
        newChallenge.createdAt = block.timestamp;
        newChallenge.timelapse = _timelapse;
        newChallenge.onETH = msg.sender == _iAS.apiPostPayable();
        challenges[challengeID] = newChallenge;
        ownerOf[challengeID] = Bindings.ownerOf(_ownerID, _iAS.cvsHub());
        challengesOfCourt[_courtID].push(challengeID);
    }

    // La fonction resolveChallenge doit être conçue de manière à vérifier la solution
    // Peut-être via un oracle ou une méthode de validation manuelle
    function tryResolveChallenge(
        uint _cvID,
        uint _challengeID,
        string memory _tokenURI
    ) external onlyProxy {
        LibChallenge.ChallengeDatas memory challenge = challenges[_challengeID];
        require(
            challenge.resolvedAt == 0 && challenge.createdAt > 0,
            "ChallengeHub: BAD_DATAS"
        );
        if (challengersOf[_challengeID][_cvID] == 0) {
            challenge.participants++;
        }
        challengersOf[_challengeID][_cvID] = IChallengersHub(
            _iAS.challengersHub()
        ).tryResolveChallenge(_cvID, _challengeID, _tokenURI);
    }

    function arbitreChallenge(
        uint _cvArbitratorID,
        uint _cvChallengerID,
        uint _challengeID
    ) external {
        IArbitratorsHub _iAH = IArbitratorsHub(_iAS.arbitratorsHub());
        IChallengersHub _iCH = IChallengersHub(_iAS.challengersHub());
        require(
            challenges[_challengeID].createdAt + block.timestamp <=
                block.timestamp,
            "Challenge on progress"
        );
        require(
            _cvArbitratorID != _cvChallengerID &&
                challengersOf[_challengeID][_cvArbitratorID] == 0 &&
                challengersOf[_challengeID][_cvChallengerID] > 0,
            "ChallengesHub: Error ID"
        );

        require(
            _iAH.arbitrationOfCV(
                _cvArbitratorID,
                challenges[_challengeID].courtID
            ) > 0,
            "Arbitrator not found"
        );
        _iCH.incrementVote(challengersOf[_challengeID][_cvChallengerID]);
        challenges[_challengeID].votes++;
        if (
            _iAH.lengthOfCourt(challenges[_challengeID].courtID) ==
            challenges[_challengeID].votes
        ) {
            //  tally
        }
    }

    // Autres fonctions nécessaires...
}
