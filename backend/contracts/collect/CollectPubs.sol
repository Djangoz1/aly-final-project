// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import {IAddressHub} from "../interfaces/IAddressHub.sol";
import {IAccessControl} from "../interfaces/IAccessControl.sol";
import {IPubsHub} from "../interfaces/IPubsHub.sol";
import {IMissionsHub} from "../interfaces/IMissionsHub.sol";

contract CollectPubs {
    /**
     * @notice key uint missionID collect missions
     * @notice return uit [] pubIDs
     */
    mapping(uint => uint[]) pubsMissions;
    mapping(uint => uint[]) pubsAnswers;

    address addressHub;
    address pubsHub;

    modifier onlyProxy() {
        require(msg.sender == pubsHub, "Must be call by proxy bindings");
        _;
    }

    constructor(address _addressHub) {
        addressHub = _addressHub;
        pubsHub = msg.sender;
    }

    function addPubMission(uint _missionID, string memory _tokenURI) external {
        IAddressHub iAH = IAddressHub(addressHub);
        IAccessControl iAC = IAccessControl(iAH.accessControl());
        IMissionsHub iMH = IMissionsHub(iAH.missionsHub());
        require(iMH.getTokensLength() >= _missionID, "Mission not exist");
        uint newPubID = iAC.createPub(_tokenURI, msg.sender);
        require(newPubID != 0, "Error create pub");
        pubsMissions[_missionID].push(newPubID);
    }

    function addPubAnswer(uint _pubID, string memory _tokenURI) external {
        IAddressHub iAH = IAddressHub(addressHub);
        IAccessControl iAC = IAccessControl(iAH.accessControl());
        IPubsHub iPH = IPubsHub(iAH.pubsHub());
        require(_pubID <= iPH.getTokensLength(), "Pub not exist");
        uint newPubID = iAC.createPub(_tokenURI, msg.sender);
        require(newPubID != 0, "Error create pub");
        pubsAnswers[_pubID].push(newPubID);
    }

    function getPubAnswers(uint _pubID) external view returns (uint[] memory) {
        IAddressHub iAH = IAddressHub(addressHub);
        IPubsHub iPH = IPubsHub(iAH.pubsHub());
        require(iPH.getTokensLength() >= _pubID, "Pub not exist");

        return pubsAnswers[_pubID];
    }

    function getPubsMission(
        uint _missionID
    ) external view returns (uint[] memory) {
        IAddressHub iAH = IAddressHub(addressHub);
        IMissionsHub iMH = IMissionsHub(iAH.missionsHub());
        require(iMH.getTokensLength() >= _missionID, "Mission not exist");
        return pubsMissions[_missionID];
    }
}
