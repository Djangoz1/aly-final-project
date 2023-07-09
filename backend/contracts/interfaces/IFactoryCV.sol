// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;



import {DataTypes} from "../libraries/DataTypes.sol";
// import {} from "./interfaces/..sol";

interface IFactoryCV {
     function createCV(address _owner) external returns (address);
     function getCVsLength() external view returns (uint);
     function getCVByAddress(address _forAddr) external view returns (address);
     function getCVById(uint _id)external view returns(address);
     function checkRegistred(address _forAddr) external view;

}