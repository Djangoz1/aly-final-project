"use client";

import { ethers } from "ethers";
import Mission from "artifacts/contracts/Mission.sol/Mission.json";
import { ADDR_FACTORY_MISSION } from "constants/address";
import { _getProvider, _getSigner } from "./web3-tools";
import { parseHex } from "helpers";
import {
  _getAccount,
  _signerContractCV,
  _signerFactoryMission,
} from "./auth-tools";

// *::::::::::::::: GET MISSION  :::::::::::::::*

export const _getAllContractsMissionByCv = async (cv) => {
  if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
    const length = parseHex(await cv.getMissionsLength());
    const missions = [];
    if (length > 0) {
      for (let index = 0; index < length; index++) {
        const mission = await cv.getMission(index);
        missions.push(mission);
      }
    } else {
      throw new Error("Error Mission : CV don't have missions");
    }

    return missions;
  }
};

export const _getContractMissionById = async (missions, id) => {
  if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
    try {
      const provider = await _getProvider();
      if (id < missions.length) {
        const missionAddr = missions[id];

        const mission = new ethers.Contract(missionAddr, Mission.abi, provider);

        return mission;
      } else {
        throw new Error("Error Mission : ID is to high");
      }
    } catch (error) {
      return error;
    }
  }
};

export const _signerContractMission = async (mission) => {
  if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
    try {
      const signer = await _getSigner();

      if (mission.address) {
        const mission = new ethers.Contract(
          mission.address,
          Mission.abi,
          signer
        );
        return mission;
      } else {
        throw new Error("Error Mission : No address to sign");
      }
    } catch (error) {
      return error;
    }
  }
};
export const _getContractMissionByCv = async (cv, id) => {
  if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
    try {
      const provider = _getProvider();

      const missionAddr = await cv.getMission(id);

      const mission = new ethers.Contract(missionAddr, Mission.abi, provider);

      return mission;
    } catch (error) {
      return error;
    }
  }
};

// *:::::::::::::::: Features ::::::::::::::::* //

export const _setFeature = async (_mission, feature) => {
  if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
    try {
      const signer = await _getSigner();
      const mission = new ethers.Contract(
        _mission.address,
        Mission.abi,
        signer
      );

      const { estimatedDay, wadge, description, assignedWorker, isInviteOnly } =
        feature;

      const tx = await mission.setFeature(
        estimatedDay,
        wadge,
        description,
        assignedWorker,
        isInviteOnly
      );
    } catch (error) {
      console.error(error);
      return error;
    }
  }
};

export const _getFeatures = async (_mission) => {
  if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
    try {
      const length = parseHex(await _mission.getFeaturesLength());
      const _features = [];
      if (length > 0) {
        for (let index = 0; index < length; index++) {
          const _feature = await _mission.getFeature(index);
          _features.push(_feature);
        }
      }

      return _features;
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
      const tx = await cv.buyMission(ADDR_FACTORY_MISSION, amount);
      tx.wait();
    } catch (error) {
      return error;
    }
  }
};
