// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import {IAddressHub} from "../interfaces/IAddressHub.sol";
import {IAccessControl} from "../interfaces/IAccessControl.sol";
import {IPubsHub} from "../interfaces/IPubsHub.sol";
import {Bindings} from "../libraries/Bindings.sol";
import {IMissionsHub} from "../interfaces/IMissionsHub.sol";

contract CollectPubs {
    /**
     * @notice key uint missionID collect missions
     * @notice return uit [] pubIDs
     */
    mapping(uint => uint[]) pubsMissions;
    mapping(uint => uint[]) pubsAnswers;
    IAddressHub private iAH;

    modifier onlyProxy() {
        require(msg.sender == iAH.pubsHub(), "Must be call by proxy bindings");
        _;
    }

    constructor(address _addressHub) {
        iAH = IAddressHub(_addressHub);
        iAH.setCollectPubs();
    }

    function addPubMission(uint _newPubID, uint _missionID, string memory _tokenURI) external {
        require(_newPubID != 0, "Error create pub");
        pubsMissions[_missionID].push(_newPubID);
    }

    function addPubAnswer(
        uint _newPubID,
        uint _pubID,
        string memory _tokenURI
    ) external {
        require(_newPubID != 0, "Error create pub");
        pubsAnswers[_pubID].push(_newPubID);
    }

    function getPubAnswers(uint _pubID) external view returns (uint[] memory) {
        require(
            Bindings.tokensLength(iAH.pubsHub()) >= _pubID,
            "Pub not exist"
        );

        return pubsAnswers[_pubID];
    }

    function getPubsMission(
        uint _missionID
    ) external view returns (uint[] memory) {
        require(
            Bindings.tokensLength(iAH.missionsHub()) >= _missionID,
            "Mission not exist"
        );
        return pubsMissions[_missionID];
    }
}
