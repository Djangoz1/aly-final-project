"use client";
// import CV from "../artifacts/contracts/CV.sol/CV.json";
import { ethers } from "ethers";
import CVFactory from "artifacts/contracts/SBToken/FactoryCV.sol/FactoryCV.json";
// import { CONTRACT_ADDRESS } from "../constants";
import CV from "artifacts/contracts/SBToken/CV.sol/CV.json";
import FactoryMission from "artifacts/contracts/FactoryMission.sol/FactoryMission.json";

import { ADDR_FACTORY_CV, ADDR_FACTORY_MISSION } from "constants/address";
// import { ethers } from "hardhat";

// *::::::::::::::: PROVIDER :::::::::::::::*

export const _getAccount = async () => {
  if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
    try {
      const result = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      return result[0];
    } catch (error) {
      return error;
    }
  }
};

// *::::::::::::::: FactoryCV :::::::::::::::*

export const _getContractFactoryCV = async () => {
  if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    try {
      const FactoryContract = new ethers.Contract(
        ADDR_FACTORY_CV,
        CVFactory.abi,
        provider
      );
      return FactoryContract;
    } catch (error) {
      return error;
    }
  }
};

export const _createContractCv = async (address) => {
  if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    try {
      const FactoryContract = new ethers.Contract(
        ADDR_FACTORY_CV,
        CVFactory.abi,
        signer
      );

      let tx = await FactoryContract.createCV(address);

      return tx;
    } catch (error) {
      return error;
    }
  }
};

export const _getCVsLength = async () => {
  if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
    const factoryCv = await _getContractFactoryCV();

    try {
      const length = await factoryCv.getCVsLength();

      return length;
    } catch (error) {
      return { ok: false, error };
    }
  }
};

// *::::::::::::::: CV :::::::::::::::*

export const _getContractCV = async (factoryCv, _address) => {
  if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const cvAddr = await factoryCv.getCV(_address);
      const cv = new ethers.Contract(cvAddr, CV.abi, provider);

      return cv;
    } catch (error) {
      return { ok: false, error };
    }
  }
};

export const _getName = async (cv) => {
  if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
    try {
      const name = await cv.name();
      return name;
    } catch (error) {
      return error;
    }
  }
};
export const _setName = async (cvAddr, name) => {
  if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const cvContract = new ethers.Contract(cvAddr, CV.abi, signer);

    const tx = await cvContract.setName(name);
    await tx.wait();
  }
};

// *::::::::::::::: FactoryMission :::::::::::::::*

export const _getContractFactoryMission = async () => {
  if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    try {
      const factoryMission = new ethers.Contract(
        ADDR_FACTORY_MISSION,
        FactoryMission.abi,
        provider
      );

      return factoryMission;
    } catch (error) {
      return error;
    }
  }
};

export const _getMissionsLength = async () => {
  if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
    const factoryMission = await _getContractFactoryMission();

    try {
      const length = await factoryMission.missionsLength();

      return length;
    } catch (error) {
      return { ok: false, error };
    }
  }
};
