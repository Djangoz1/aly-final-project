// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import {DataTypes} from "../libraries/DataTypes.sol";

import {ICVHub} from "../interfaces/ICVHub.sol";
import {IERC721} from "../interfaces/IERC721.sol";
import {IArbitratorsHub} from "../interfaces/IArbitratorsHub.sol";
import {IContract} from "../interfaces/IContract.sol";

library Bindings {
    function getCV(address _for, address _cvHub) internal view returns (uint) {
        return ICVHub(_cvHub).getCV(_for);
    }

    function arbitratorOf(
        uint _cvID,
        DataTypes.CourtIDs _courtID,
        address _arbitratorsHub
    ) internal view returns (uint) {
        return
            IArbitratorsHub(_arbitratorsHub).getArbitrationOfCV(
                _cvID,
                _courtID
            );
    }

    function ownerOf(
        uint _tokenID,
        address _ercAddr
    ) internal view returns (address) {
        return IERC721(_ercAddr).ownerOf(_tokenID);
    }

    function tokenURI(
        uint _tokenID,
        address _ercAddr
    ) internal view returns (string memory) {
        return IERC721(_ercAddr).tokenURI(_tokenID);
    }

    function tokensLength(address _ercAddr) internal view returns (uint) {
        return IContract(_ercAddr).getTokensLength();
    }

    // Ajoutez votre code ici
}
