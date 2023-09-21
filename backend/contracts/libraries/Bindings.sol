// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {DataTypes} from "./DataTypes.sol";

import {ICVsHub} from "../interfaces/cv/ICVsHub.sol";
import {IERC721} from "../interfaces/erc/IERC721.sol";
import {IArbitratorsHub} from "../interfaces/escrow/IArbitratorsHub.sol";
import {IContract} from "../interfaces/system/IContract.sol";

library Bindings {
    function cvOf(address _for, address _CVsHub) internal view returns (uint) {
        return ICVsHub(_CVsHub).cvOf(_for);
    }

    function arbitratorOf(
        uint _cvID,
        DataTypes.CourtIDs _courtID,
        address _arbitratorsHub
    ) internal view returns (uint) {
        return
            IArbitratorsHub(_arbitratorsHub).arbitrationOfCV(_cvID, _courtID);
    }

    function ownerOf(
        uint _tokenID,
        address _ercAddr
    ) internal view returns (address) {
        return IERC721(_ercAddr).ownerOf(_tokenID);
    }

    function balanceOf(
        address _owner,
        address _ercAddr
    ) internal view returns (uint) {
        return IERC721(_ercAddr).balanceOf(_owner);
    }

    function tokenURI(
        uint _tokenID,
        address _ercAddr
    ) internal view returns (string memory) {
        return IERC721(_ercAddr).tokenURI(_tokenID);
    }

    function tokensLength(address _ercAddr) internal view returns (uint) {
        return IContract(_ercAddr).tokensLength();
    }

    function indexerOf(
        uint _tokenID,
        address _ercAddr
    ) internal view returns (uint[] memory) {
        return IContract(_ercAddr).indexerOf(_tokenID);
    }

    // Ajoutez votre code ici
}
