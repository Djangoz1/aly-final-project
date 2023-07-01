// "use client";
// import { ethers } from "ethers";
// import CVFactory from "artifacts/contracts/SBToken/FactoryCV.sol/FactoryCV.json";
// import CV from "artifacts/contracts/SBToken/CV.sol/CV.json";
// import FactoryMission from "artifacts/contracts/FactoryMission.sol/FactoryMission.json";

import { _getterCV, _getterMISSION } from "./web3-tools";

// import {
//   ADDR_FACTORY_CV,
//   ADDR_FACTORY_MISSION,
// } from "../../../../backend/constants/address";

// import { _getProvider, _getSigner } from "./web3-tools";
// import { _getContractMissionByAddress } from "./mission-tools";
// import { parseHex } from "helpers";

// // *::::::::::::::: PROVIDER :::::::::::::::*

// // *::::::::::::::: FactoryCV :::::::::::::::*

// // *::::::::::::::: CV :::::::::::::::*

export const _getStateOwnerByCv = async (cvAddress) => {
  console.log("cvAddress", cvAddress);

  const objectOwner = {
    cvAddress: cvAddress, //
    address: "", //
    name: "", //
    missions: [], //
    featuresLength: 0, //
    amountDispersed: 0,
  };

  objectOwner.featuresLength = parseInt(
    await _getterCV(cvAddress, "getFeaturesLength")
  );

  console.log("objectOwner.featuresLength", objectOwner.featuresLength);

  //   if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
  //     const cv = await _getContractCVByAddress(cvAddress);
  //     if (cv) {
  //       let _name = await cv?.name();
  //       objectOwner.name = _name;
  //       let _address = await cv?.owner();
  //       objectOwner.address = _address;
  //       let missionsLength = await cv?.getMissionsLength();
  //       for (let index = 0; index < missionsLength; index++) {
  //         const missionAddr = await cv?.getMission(index);
  //         objectOwner.missions.push(missionAddr);
  //         const mission = await _getContractMissionByAddress(missionAddr);

  //         // let _featuresLength = parseHex(await mission?.getFeaturesLength()); //prettier-ignore
  //         // objectOwner.featuresLength += _featuresLength;

  //         if (objectOwner?.featuresLength > 0) {
  //           for (let index = 0; index < _featuresLength; index++) {
  //             const feature = await mission.getFeature(index);
  //             objectOwner.amountDispersed += parseHex(feature.wadge);
  //           }
  //         }
  //       }
  //     }

  //     return objectOwner;
  //   }
};

export const _getStateOwnerMission = async (missionAddr) => {
  console.log("missionAddr", missionAddr);
  const owner = await _getterMISSION(missionAddr, "owner");
  console.log("owner", owner);
  const objectOwner = await _getStateOwnerByCv(owner);
  return objectOwner;
  //   if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
  //     try {
  // const contract = await _getContractMissionByAddress(missionAddr);
  //       const ownerAddr = await contract?.owner();

  //     } catch (error) {
  //       return error;
  //     }
  //   }
};

// // *::::::::::::::: FactoryMission :::::::::::::::*

// export const _getContractFactoryMission = async () => {
//   if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
//     const provider = new ethers.providers.Web3Provider(window.ethereum);
//     try {
//       const factoryMission = new ethers.Contract(
//         ADDR_FACTORY_MISSION,
//         FactoryMission.abi,
//         provider
//       );

//       return factoryMission;
//     } catch (error) {
//       return error;
//     }
//   }
// };
// export const _signerFactoryMission = async () => {
//   if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
//     const provider = new ethers.providers.Web3Provider(window.ethereum);
//     const signer = provider.getSigner();
//     try {
//       const factoryMission = new ethers.Contract(
//         ADDR_FACTORY_MISSION,
//         FactoryMission.abi,
//         signer
//       );

//       return factoryMission;
//     } catch (error) {
//       return error;
//     }
//   }
// };
