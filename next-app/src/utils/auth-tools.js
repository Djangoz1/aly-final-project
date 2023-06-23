// import CV from "../artifacts/contracts/CV.sol/CV.json";
import { ethers } from "ethers";
import CVFactory from "artifacts/contracts/SBToken/FactoryCV.sol/FactoryCV.json";
// import { CONTRACT_ADDRESS } from "../constants";

import { ADDR_FACTORY_CV } from "constants/address";
// import { ethers } from "hardhat";

export const _getAccount = async () => {
  if (typeof window.ethereum !== "undefined") {
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

export const _getContractFactoryCV = async () => {
  if (typeof window.ethereum !== "undefined") {
    // const provider = new ethers.providers.Web3Provider(window.ethereum);
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
