"use client";
import { ethers } from "ethers";
import CVFactory from "artifacts/contracts/SBToken/FactoryCV.sol/FactoryCV.json";
import CV from "artifacts/contracts/SBToken/CV.sol/CV.json";
import FactoryMission from "artifacts/contracts/FactoryMission.sol/FactoryMission.json";

import { ADDR_FACTORY_CV, ADDR_FACTORY_MISSION } from "constants/address";
import { _getProvider } from "./web3-tools";
import { _getContractMissionByAddress } from "./mission-tools";
import { parseHex } from "helpers";

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

export const _getContractCVByAddress = async (_address) => {
  if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
    try {
      const provider = await _getProvider();
      const cv = new ethers.Contract(_address, CV.abi, provider);
      return cv;
    } catch (error) {
      return error;
    }
  }
};

export const _getContractCV = async (factoryCv, _address) => {
  if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const cvAddr = await factoryCv.getCV(_address);
      const cv = await _getContractCVByAddress(cvAddr);

      return cv;
    } catch (error) {
      return { ok: false, error };
    }
  }
};
export const _signerContractCV = async (factoryCv, _address) => {
  if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      const cvAddr = await factoryCv.getCV(_address);
      const cv = new ethers.Contract(cvAddr, CV.abi, signer);

      return cv;
    } catch (error) {
      return { ok: false, error };
    }
  }
};

export const _getName = async (cvAddr) => {
  if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
    const provider = await _getProvider();
    try {
      const cv = new ethers.Contract(cvAddr, CV.abi, provider);
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

export const _getStateOwnerMission = async (missionAddr) => {
  if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
    try {
      const contract = await _getContractMissionByAddress(missionAddr);
      const objectOwner = {
        cvAddress: await contract?.ownerCV(), //
        address: "", //
        name: "", //
        missions: [], //
        featuresLength: 0, //
        amountDispersed: 0,
      };

      const cv = await _getContractCVByAddress(objectOwner?.cvAddress);

      if (cv) {
        let _name = await cv?.name();
        objectOwner.name = _name;
        let _address = await cv?.owner();
        objectOwner.address = _address;
        let missionsLength = await cv?.getMissionsLength();
        for (let index = 0; index < missionsLength; index++) {
          const missionAddr = await cv?.getMission(index);
          objectOwner.missions.push(missionAddr);
          const mission = await _getContractMissionByAddress(missionAddr);

          let _featuresLength = parseHex(await mission?.getFeaturesLength()); //prettier-ignore
          objectOwner.featuresLength += _featuresLength;

          if (_featuresLength > 0) {
            for (let index = 0; index < _featuresLength; index++) {
              const feature = await mission.getFeature(index);
              objectOwner.amountDispersed += parseHex(feature.wadge);
            }
          }
        }
      }

      return objectOwner;
    } catch (error) {
      return error;
    }
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
export const _signerFactoryMission = async () => {
  if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    try {
      const factoryMission = new ethers.Contract(
        ADDR_FACTORY_MISSION,
        FactoryMission.abi,
        signer
      );

      return factoryMission;
    } catch (error) {
      return error;
    }
  }
};
