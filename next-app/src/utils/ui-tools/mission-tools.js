"use client";
// import CV from "../artifacts/contracts/CV.sol/CV.json";
import { ethers } from "ethers";
import CVFactory from "artifacts/contracts/SBToken/FactoryCV.sol/FactoryCV.json";
// import { CONTRACT_ADDRESS } from "../constants";
import CV from "artifacts/contracts/SBToken/CV.sol/CV.json";
import FactoryMission from "artifacts/contracts/FactoryMission.sol/FactoryMission.json";

import { ADDR_FACTORY_CV, ADDR_FACTORY_MISSION } from "constants/address";
import {
  _getAccount,
  _signerContractCV,
  _signerFactoryMission,
} from "./auth-tools";
// import { ethers } from "hardhat";

// *::::::::::::::: GET MISSION  :::::::::::::::*

export const _getContractMissionByCv = async (cv, id) => {
  if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
    try {
      const mission = await cv.getMission(id);
      return mission;
    } catch (error) {
      return error;
    }
  }
};

export const _createContractMission = async (factoryCv, amount) => {
  if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
    try {
      const address = await _getAccount();

      const cv = await _signerContractCV(factoryCv, address);
      console.log("test", cv);

      const tx = await cv.buyMission(ADDR_FACTORY_MISSION, amount);
      console.log("tx", tx);
    } catch (error) {}
  }
};
