// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import {DataTypes} from "../libraries/DataTypes.sol";
import {IAccessControl} from "../interfaces/IAccessControl.sol";
import {ICVHub} from "../interfaces/ICVHub.sol";
import {IAddressHub} from "../interfaces/IAddressHub.sol";

contract ArbitratorsHub {
    using Counters for Counters.Counter;
    // We don't use  ERC721 standard for reducing gas cost
    Counters.Counter private _tokenIDs;

    /**
     * @dev indexers is a mapping of each arbitrator ID to its data
     */
    mapping(uint256 => DataTypes.ArbitratorData) public datas;

    /**
     * @dev indexers is a mapping of each court ID to an array of arbitrator ID
     */
    mapping(DataTypes.CourtIDs => uint256[]) public indexersCourt;

    mapping(uint256 => mapping(DataTypes.CourtIDs => uint256))
        public indexersCV;
    // Ajoutez votre code ici

    IAddressHub public addressHub;

    modifier onlyProxy() {
        require(
            msg.sender == addressHub.accessControl(),
            "Must call by proxy bindings"
        );
        _;
    }

    constructor(address _addressHub) {
        require(
            _addressHub != address(0),
            "ArbitratorHub: Invalid address hub"
        );
        addressHub = IAddressHub(_addressHub);
        addressHub.setArbitratorsHub(address(this));
    }

    function setArbitrator(
        uint _cvID,
        DataTypes.CourtIDs _courtID
    ) external onlyProxy {
        ICVHub cvHub = ICVHub(addressHub.cvHub());

        require(
            _cvID <= cvHub.getTokensLength(),
            "ArbitratorHub: Invalid CV ID"
        );
        require(
            indexersCV[_cvID][_courtID] == 0,
            "ArbitratorHub: Arbitrator already added"
        );
        _tokenIDs.increment();
        DataTypes.ArbitratorData memory newArbitrator;
        newArbitrator.id = _tokenIDs.current();
        newArbitrator.cvID = _cvID;
        newArbitrator.indexedAtCourt = indexersCourt[_courtID].length - 1;
        datas[newArbitrator.id] = newArbitrator;
        indexersCourt[_courtID].push(newArbitrator.id);
        indexersCV[_cvID][_courtID] = newArbitrator.id;
    }

    function investOnCourt(DataTypes.CourtIDs _courtID) external payable {
        ICVHub cvHub = ICVHub(addressHub.cvHub());
        uint cvID = cvHub.getCV(msg.sender);
        require(cvID != 0, "ArbitratorHub: CV not found");
        uint arbitratorID = indexersCV[cvID][_courtID];
        require(arbitratorID != 0, "ArbitratorHub: Arbitrator not found");
        require(msg.value > 0, "ArbitratorHub: Invalid value");
        datas[arbitratorID].balance += msg.value;
    }

    function withdrawFromCourt(
        DataTypes.CourtIDs _courtID,
        uint _amount
    ) external {
        ICVHub cvHub = ICVHub(addressHub.cvHub());
        uint cvID = cvHub.getCV(msg.sender);
        require(cvID != 0, "ArbitratorHub: CV not found");
        uint arbitratorID = indexersCV[cvID][_courtID];
        require(arbitratorID != 0, "ArbitratorHub: Arbitrator not found");

        DataTypes.ArbitratorData storage arbitrator = datas[arbitratorID];
        require(
            arbitrator.courtID >= _courtID,
            "ArbitratorHub: Missmatch court ID"
        );
        require(
            arbitrator.balance >= _amount,
            "ArbitratorHub: Arbitrator balance is empty"
        );
        arbitrator.balance -= _amount;
        payable(msg.sender).transfer(_amount);
        // ! REENTRENCY ?
        datas[arbitratorID] = arbitrator;
    }

    function selectArbitrator(
        DataTypes.CourtIDs _courtID
    ) external view returns (uint256) {
        uint256[] memory arbitrators = indexersCourt[_courtID];
        uint256 nbArbitrators = arbitrators.length;
        require(nbArbitrators > 0, "ArbitratorHub: No arbitrator");
        uint256 random = uint256(
            keccak256(
                abi.encodePacked(
                    block.timestamp,
                    block.difficulty,
                    block.number
                )
            )
        );
        return arbitrators[random % nbArbitrators];
    }

    function selectArbitrator(
        DataTypes.CourtIDs _courtID,
        uint _arbitratorID
    ) external view returns (uint256) {
        uint256[] memory arbitrators = indexersCourt[_courtID];
        uint256 nbArbitrators = arbitrators.length;
        require(nbArbitrators > 0, "ArbitratorHub: No arbitrator");
        return arbitrators[_arbitratorID];
    }

    function getCourtLength(
        DataTypes.CourtIDs _courtID
    ) external view returns (uint256) {
        return indexersCourt[_courtID].length;
    }

    function getData(
        uint256 _arbitratorID
    ) external view returns (DataTypes.ArbitratorData memory) {
        require(
            _arbitratorID <= _tokenIDs.current(),
            "ArbitratorHub: Invalid arbitrator ID"
        );
        return datas[_arbitratorID];
    }

    function getArbitrationOfCV(
        uint _cvID,
        DataTypes.CourtIDs _courtID
    ) external view returns (uint256) {
        require(
            indexersCV[_cvID][_courtID] > 0,
            "ArbitratorHub: Arbitration not found"
        );
        return indexersCV[_cvID][_courtID];
    }

    function incrementVote(uint cvID, DataTypes.CourtIDs _courtID) external {
        require(
            indexersCV[cvID][_courtID] > 0,
            "ArbitratorHub: Arbitration not found"
        );
        datas[indexersCV[cvID][_courtID]].nbArbitrations++;
    }
}
