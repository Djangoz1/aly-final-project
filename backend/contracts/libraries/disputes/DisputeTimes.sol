// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

library DisputeTimes {
    // Ajoutez votre code ici

    struct Data {
        uint256 createdAt;
        uint256 startedAt;
        uint256 talliedAt;
        uint256 reclaimedAt;
        uint256 resolvedAt;
    }

    function createdAt(Data storage data) internal view returns (uint256) {
        return data.createdAt;
    }

    function create(Data storage data) internal {
        unchecked {
            data.createdAt = block.timestamp;
        }
    }

    function reclaimedAt(Data storage data) internal view returns (uint256) {
        return data.reclaimedAt;
    }

    function reclaim(Data storage data) internal {
        unchecked {
            data.reclaimedAt = block.timestamp;
        }
    }

    function startedAt(Data storage data) internal view returns (uint256) {
        return data.startedAt;
    }

    function startAt(Data storage data) internal {
        unchecked {
            data.startedAt = block.timestamp;
        }
    }

    function refresh(Data storage data) internal {
        data.startedAt = 0;
        data.reclaimedAt = 0;
        data.resolvedAt = 0;
    }
}
