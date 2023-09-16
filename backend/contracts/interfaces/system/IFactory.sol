// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;
import {DisputeDatas} from "../../libraries/disputes/DisputeDatas.sol";

interface IFactory {
    function mintDispute(
        address _to,
        DisputeDatas.Data memory data
    ) external returns (address);
}
