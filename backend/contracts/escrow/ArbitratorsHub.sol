// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
// import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

import {DataTypes} from "../libraries/DataTypes.sol";
import {Bindings} from "../libraries/Bindings.sol";

import {IToken} from "../interfaces/erc/IToken.sol";
import {IDispute} from "../interfaces/escrow/IDispute.sol";
import {IDisputesHub} from "../interfaces/escrow/IDisputesHub.sol";
import {ICVsHub} from "../interfaces/cv/ICVsHub.sol";
import {IAddressSystem} from "../interfaces/system/IAddressSystem.sol";

contract ArbitratorsHub is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    // We don't use  ERC721 standard for reducing gas cost
    Counters.Counter private _tokenIDs;
    using SafeMath for uint256;

    uint internal constant maxSuspectVote = 3;

    /**
     * @dev indexers is a mapping of each arbitrator ID to its data
     */
    mapping(uint256 => DataTypes.ArbitratorData) internal datas;
    mapping(uint256 => uint8) internal _suspectVote;
    /**
     * @dev indexers is a mapping of each court ID to an array of arbitrator ID
     */
    mapping(DataTypes.CourtIDs => uint256[]) internal indexersCourt;

    mapping(uint256 => mapping(DataTypes.CourtIDs => uint256))
        internal indexersCV;
    // Ajoutez votre code ici

    IAddressSystem private _iAS;

    modifier onlyProxy() {
        require(
            msg.sender == _iAS.featuresHub() ||
                msg.sender == _iAS.apiPost() ||
                msg.sender == _iAS.apiPostPayable() ||
                msg.sender == _iAS.disputesHub(),
            "Must call by proxy bindings"
        );
        _;
    }

    constructor(address _addressSystem) ERC721("Arbitrator", "WA") {
        _iAS = IAddressSystem(_addressSystem);
        _iAS.setArbitratorsHub();
        require(
            _iAS.arbitratorsHub() == address(this),
            "ArbitratorsHub : Error deployment"
        );
    }

    function setArbitrator(
        uint _cvID,
        DataTypes.CourtIDs _courtID
    ) external onlyProxy {
        address _addrCVH = _iAS.cvsHub();
        require(_cvID <= Bindings.tokensLength(_addrCVH), "Invalid CV ID");
        require(indexersCV[_cvID][_courtID] == 0, "Arbitrator already added");
        _tokenIDs.increment();
        DataTypes.ArbitratorData memory newArbitrator;
        newArbitrator.id = _tokenIDs.current();
        newArbitrator.cvID = _cvID;
        _mint(Bindings.ownerOf(_cvID, _addrCVH), newArbitrator.id);
        newArbitrator.indexedAtCourt = indexersCourt[_courtID].length;
        newArbitrator.courtID = _courtID;
        datas[newArbitrator.id] = newArbitrator;
        indexersCourt[_courtID].push(newArbitrator.id);
        indexersCV[_cvID][_courtID] = newArbitrator.id;
    }

    function calculateWeight(uint256 balance) internal pure returns (uint256) {
        // Inverser le solde de l'arbitre (plus le solde est faible, plus le poids est élevé).
        // Vous pouvez ajuster cette formule en fonction de vos préférences.
        return 1e18 / balance;
    }

    function randomlyArbitrator(
        DataTypes.CourtIDs _courtID,
        uint _randomID
    ) external view returns (uint256) {
        uint256[] memory arbitrators = indexersCourt[_courtID];
        uint256 nbArbitrators = arbitrators.length;
        require(nbArbitrators > 0, "ArbitratorHub: No arbitrator");

        // Sélection aléatoire avec un biais pour l'arbitre équilibré.
        uint256 random = uint256(
            keccak256(
                abi.encodePacked(
                    block.timestamp,
                    block.prevrandao,
                    block.number,
                    msg.sender, // Vous pouvez utiliser l'adresse de l'appelant pour introduire un biais.
                    _randomID
                )
            )
        );

        // Utilisez le modulo pour obtenir un indice dans la plage des arbitres disponibles.
        uint256 selectedArbitratorIndex = random % nbArbitrators;

        // Assurez-vous que l'indice est dans les limites du tableau des arbitres.
        require(
            selectedArbitratorIndex < nbArbitrators,
            "Invalid selected arbitrator index"
        );

        // Retournez l'adresse de l'arbitre sélectionné.
        return arbitrators[selectedArbitratorIndex];
    }

    function boostRandomlyArbitrator(
        DataTypes.CourtIDs _courtID,
        uint _rand
    ) external view returns (uint256) {
        uint256[] memory arbitrators = indexersCourt[_courtID];
        uint256 nbArbitrators = arbitrators.length;
        require(nbArbitrators > 0, "ArbitratorHub: No arbitrator");

        uint totalBalance = IToken(_iAS.token()).totalStaked();

        // Générez un nombre aléatoire pondéré en fonction des poids.
        uint256 random = uint256(
            keccak256(
                abi.encodePacked(
                    block.timestamp,
                    block.prevrandao,
                    block.number,
                    _rand
                )
            )
        ) % totalBalance;

        uint256 cumulativeBalance = 0;
        uint resultID;
        uint256 randomID;

        for (uint256 i = 1; i <= nbArbitrators; i++) {
            randomID = (
                (uint256(
                    keccak256(
                        abi.encodePacked(
                            block.timestamp,
                            block.prevrandao,
                            block.number,
                            _rand
                        )
                    )
                ) % nbArbitrators)
            );
            randomID = randomID == 0 ? randomID + 1 : randomID;
            cumulativeBalance += IToken(_iAS.token()).staked(
                Bindings.ownerOf(randomID, _iAS.cvsHub())
            );
            if (random < cumulativeBalance) {
                resultID = arbitrators[randomID];
                _rand++;
                break;
            }
        }

        return randomID;
    }

    function lengthOfCourt(
        DataTypes.CourtIDs _courtID
    ) external view returns (uint256) {
        return indexersCourt[_courtID].length;
    }

    function indexerOf(
        DataTypes.CourtIDs _courtID
    ) external view returns (uint256[] memory) {
        return indexersCourt[_courtID];
    }

    function tokensLength() external view returns (uint256) {
        return _tokenIDs.current();
    }

    function dataOf(
        uint256 _arbitratorID
    ) external view returns (DataTypes.ArbitratorData memory) {
        require(_arbitratorID <= _tokenIDs.current(), "Invalid arbitrator ID");
        return datas[_arbitratorID];
    }

    /**
     * @notice function called by disputesDatasHub._tallyFor
     */
    function incrementSuspectVote(uint256 _arbitratorID) external {
        require(msg.sender == _iAS.disputesDatasHub(), "Not allowed");
        _suspectVote[_cvOf(ownerOf(_arbitratorID))]++;
    }

    function isBanned(uint256 _cvID) external view returns (bool) {
        require(
            Bindings.tokensLength(_iAS.cvsHub()) >= _cvID,
            "ID out of range"
        );
        return _suspectVote[_cvID] >= 3;
    }

    function suspectVoteOf(uint256 _cvID) external view returns (uint) {
        require(
            Bindings.tokensLength(_iAS.cvsHub()) >= _cvID,
            "ID out of range"
        );
        return _suspectVote[_cvID];
    }

    function unbanned(uint256 _cvID) external onlyOwner {
        require(
            Bindings.tokensLength(_iAS.cvsHub()) >= _cvID,
            "ID out of range"
        );
        _suspectVote[_cvID] = 0;
    }

    function arbitrationOfCV(
        uint _cvID,
        DataTypes.CourtIDs _courtID
    ) external view returns (uint256) {
        require(indexersCV[_cvID][_courtID] > 0, "Arbitration not found");
        return indexersCV[_cvID][_courtID];
    }

    function acceptArbitration(
        uint _cvID,
        DataTypes.CourtIDs _courtID,
        uint _disputeID
    ) external onlyProxy {
        require(
            datas[indexersCV[_cvID][_courtID]].cvID == _cvID,
            "AcceptArbitration: Not allowed"
        );
        datas[indexersCV[_cvID][_courtID]].disputes.push(_disputeID);
    }

    /**
     * @notice function called by dispute.vote()
     */
    function incrementVote(uint cvID, DataTypes.CourtIDs _courtID) external {
        require(
            IDisputesHub(_iAS.disputesHub()).addressOf(
                IDispute(msg.sender).id()
            ) == msg.sender,
            "Not allowed"
        );
        require(
            indexersCV[cvID][_courtID] > 0,
            "ArbitratorHub: Arbitration not found"
        );
        datas[indexersCV[cvID][_courtID]].nbArbitrations++;
    }

    function _cvOf(address _for) internal view returns (uint) {
        return Bindings.cvOf(_for, _iAS.cvsHub());
    }
}
