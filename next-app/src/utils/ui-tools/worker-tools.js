"use client";

import { ethers } from "ethers";
// import { ethers } from "hardhat";
import Mission from "artifacts/contracts/Mission.sol/Mission.json";

import { ADDR_FACTORY_MISSION } from "constants/address";
import { _getProvider, _getSigner } from "./web3-tools";
import { parseHex, selectLanguage } from "helpers";
import {
  _getAccount,
  _getContractCVByAddress,
  _getContractFactoryMission,
  _getName,
  _signerContractCV,
  _signerCv,
  _signerFactoryMission,
} from "./auth-tools";

// *::::::::::::::: GET MISSION  :::::::::::::::*

export const _joinFeature = async (cvAddr, _missionAddr, _idFeature) => {
  const cv = await _signerCv(cvAddr);
  await cv.beAssignedWorker(_missionAddr, _idFeature);
};
