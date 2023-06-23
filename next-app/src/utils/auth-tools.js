"use client";
// import CV from "../artifacts/contracts/CV.sol/CV.json";
import { ethers } from "ethers";
import CVFactory from "artifacts/contracts/SBToken/FactoryCV.sol/FactoryCV.json";
// import { CONTRACT_ADDRESS } from "../constants";
import CV from "artifacts/contracts/SBToken/CV.sol/CV.json";

import { ADDR_FACTORY_CV } from "constants/address";
// import { ethers } from "hardhat";

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

export const _getContractCV = async (factoryCv, _address) => {
  if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      console.log("vc", _address);

      const cvAddr = await factoryCv.getCV(_address);

      const cv = new ethers.Contract(cvAddr, CV.abi, provider);
      console.log("coucou", cv);
      return cv;
    } catch (error) {
      return { ok: false, error };
    }
  }
};

export const _getCVsLength = async () => {
  //   if (typeof window.ethereum !== "undefined") {
  if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
    const factoryCv = await _getContractFactoryCV();

    // const address = await _getAccount();
    // console.log(address);
    try {
      const length = await factoryCv.getCVsLength();

      return length;
    } catch (error) {
      return { ok: false, error };
    }
  }
};

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
    let _accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
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
