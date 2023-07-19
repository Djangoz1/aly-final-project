// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

// import "@openzeppelin/contracts/access/Ownable.sol";

import {DataTypes} from "./DataTypes.sol";

// import {} from "./interfaces/..sol";

library Events {
    // Ajoutez votre code ici
    event WorkflowSet(
        DataTypes.AccessControlStatus _toStatus,
        DataTypes.AccessControlStatus _fromStatus
    );

    event CVCreated(address _to, uint _id);

    event InvestedOnTokens(address _to, uint _value, uint _tokens);
}
