// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "hardhat/console.sol";

import {DataTypes} from "../libraries/DataTypes.sol";
import {Bindings} from "../libraries/Bindings.sol";
import {IAccessControl} from "../interfaces/IAccessControl.sol";
import {ICVHub} from "../interfaces/ICVHub.sol";
import {IAddressHub} from "../interfaces/IAddressHub.sol";

contract ArbitratorsHub is ERC721URIStorage {
    using Counters for Counters.Counter;
    // We don't use  ERC721 standard for reducing gas cost
    Counters.Counter private _tokenIDs;

    /**
     * @dev indexers is a mapping of each arbitrator ID to its data
     */
    mapping(uint256 => DataTypes.ArbitratorData) internal datas;

    /**
     * @dev indexers is a mapping of each court ID to an array of arbitrator ID
     */
    mapping(DataTypes.CourtIDs => uint256[]) internal indexersCourt;
    mapping(DataTypes.CourtIDs => uint256) internal balancesCourt;

    mapping(uint256 => mapping(DataTypes.CourtIDs => uint256))
        internal indexersCV;
    // Ajoutez votre code ici

    IAddressHub private addressHub;

    modifier onlyProxy() {
        require(
            msg.sender == addressHub.featuresHub() || msg.sender == addressHub.apiPost(),
            "Must call by proxy bindings"
        );
        _;
    }

    constructor(address _addressHub) ERC721("Arbitrator", "WA") {
        require(
            _addressHub != address(0),
            "ArbitratorHub: Invalid address hub"
        );
        addressHub = IAddressHub(_addressHub);
        addressHub.setArbitratorsHub();
    }

    function setArbitrator(
        uint _cvID,
        DataTypes.CourtIDs _courtID
    ) external onlyProxy {
        address _addrCVH = addressHub.cvHub();
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

    function investOnCourt(uint _cvID, uint _amount,  DataTypes.CourtIDs _courtID) external payable onlyProxy {
        uint arbitratorID = indexersCV[_cvID][_courtID];
        require(arbitratorID != 0, "Arbitrator not found");
        datas[arbitratorID].balance += _amount;
        balancesCourt[_courtID] += _amount;
    }

    function withdrawFromCourt(
        uint _cvID, 
        uint _amount,
        DataTypes.CourtIDs _courtID
    ) external onlyProxy{
        

        uint arbitratorID = indexersCV[_cvID][_courtID];
        require(arbitratorID != 0, "Arbitrator not found");
        require(datas[arbitratorID].courtID >= _courtID, "Missmatch court ID");
        require(datas[arbitratorID].balance >= _amount, "No enough balance");
        datas[arbitratorID].balance -= _amount;
        balancesCourt[_courtID] -= _amount;
        
        // ! REENTRENCY ?
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

        uint totalBalance = balancesCourt[_courtID];

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
            cumulativeBalance += datas[randomID].balance;
            if (random < cumulativeBalance) {
                resultID = arbitrators[randomID];
                _rand++;
                break;
            }
        }

        return randomID;
    }

    // function selectArbitrator(
    //     DataTypes.CourtIDs _courtID,
    //     uint _arbitratorID
    // ) external view returns (uint256) {
    //     uint256[] memory arbitrators = indexersCourt[_courtID];
    //     uint256 nbArbitrators = arbitrators.length;
    //     require(nbArbitrators > 0, "ArbitratorHub: No arbitrator");
    //     return arbitrators[_arbitratorID];
    // }

    function getCourtLength(
        DataTypes.CourtIDs _courtID
    ) external view returns (uint256) {
        return indexersCourt[_courtID].length;
    }

    function balanceOfCourt(
        DataTypes.CourtIDs _courtID
    ) external view returns (uint256) {
        return balancesCourt[_courtID];
    }

    function getTokensLength() external view returns (uint256) {
        return _tokenIDs.current();
    }

    function getData(
        uint256 _arbitratorID
    ) external view returns (DataTypes.ArbitratorData memory) {
        require(_arbitratorID <= _tokenIDs.current(), "Invalid arbitrator ID");
        return datas[_arbitratorID];
    }

    function getArbitrationOfCV(
        uint _cvID,
        DataTypes.CourtIDs _courtID
    ) external view returns (uint256) {
        require(indexersCV[_cvID][_courtID] > 0, "Arbitration not found");
        return indexersCV[_cvID][_courtID];
    }

    function incrementVote(uint cvID, DataTypes.CourtIDs _courtID) external {
        // ! Faire un onlyDisputeHub
        require(
            indexersCV[cvID][_courtID] > 0,
            "ArbitratorHub: Arbitration not found"
        );
        datas[indexersCV[cvID][_courtID]].nbArbitrations++;
    }

    function _getCV(address _for) internal view returns (uint) {
        return Bindings.getCV(_for, addressHub.cvHub());
    }
}
