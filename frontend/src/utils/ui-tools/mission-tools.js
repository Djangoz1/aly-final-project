// "use client";

import { ZERO_ADDRESS } from "constants/web3";
import { _getterFactoryMISSION, _setterMISSION } from "./web3-tools";

// import { ethers } from "ethers";
// // import { ethers } from "hardhat";
// import Mission from "artifacts/contracts/Mission.sol/Mission.json";

// import { ADDR_FACTORY_MISSION } from "../../../../backend/constants/address";
// import { _getProvider, _getSigner } from "./web3-tools";
// import { parseHex, selectLanguage } from "helpers";
// import {
//   _getAccount,
//   _getContractCVByAddress,
//   _getContractFactoryMission,
//   _getName,
//   _signerContractCV,
//   _signerCv,
//   _signerFactoryMission,
// } from "./auth-tools";

// // *::::::::::::::: GET MISSION  :::::::::::::::*

export const _getAllContractsMissionByFactory = async () => {
  const length = parseInt(await _getterFactoryMISSION("getMissionsLength"));
  console.log(length);
  const missions = [];
  for (let index = 0; index < length; index++) {
    const mission = await _getterFactoryMISSION("getMission", [index]);
    missions.push(mission);
  }
  console.log(missions);

  return missions;
};

// export const _getAllContractsMissionByCv = async (cv) => {
//   if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
//     const length = parseHex(await cv.getMissionsLength());
//     const missions = [];
//     if (length > 0) {
//       for (let index = 0; index < length; index++) {
//         const mission = await cv.getMission(index);
//         missions.push(mission);
//       }
//     } else {
//       throw new Error("Error Mission : CV don't have missions");
//     }

//     return missions;
//   }
// };

// export const _getContractMissionById = async (missions, id) => {
//   if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
//     try {
//       const provider = await _getProvider();
//       if (id < missions.length) {
//         const missionAddr = missions[id];

//         const mission = new ethers.Contract(missionAddr, Mission.abi, provider);

//         return mission;
//       } else {
//         throw new Error("Error Mission : ID is to high");
//       }
//     } catch (error) {
//       return error;
//     }
//   }
// };

// export const _signerContractMission = async (mission) => {
//   if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
//     try {
//       const signer = await _signerCv();

//       if (mission.address) {
//         const mission = new ethers.Contract(
//           mission.address,
//           Mission.abi,
//           signer
//         );
//         return mission;
//       } else {
//         throw new Error("Error Mission : No address to sign");
//       }
//     } catch (error) {
//       return error;
//     }
//   }
// };
// export const _getContractMissionByCv = async (cv, id) => {
//   if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
//     try {
//       const provider = _getProvider();

//       const missionAddr = await cv.getMission(id);

//       const mission = new ethers.deployContract(
//         missionAddr,
//         Mission.abi,
//         provider
//       );

//       return mission;
//     } catch (error) {
//       return error;
//     }
//   }
// };

// // *:::::::::::::::: Features ::::::::::::::::* //

export const _setFeature = async (missionAddr, feature) => {
  try {
    let { estimatedDay, wadge, description, assignedWorker, inviteOnly } =
      feature;
    const _description =
      feature?.description?.dev + ": " + feature.description.desc;

    await _setterMISSION(missionAddr, "setFeature", [
      parseInt(estimatedDay),
      parseInt(wadge),
      _description,
      assignedWorker,
      inviteOnly,
    ]);
  } catch (error) {
    console.error(error);
    return error;
  }
};

// export const _getFeatures = async (_missionAddr) => {
//   if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
//     const _mission = await _getContractMissionByAddress(_missionAddr);

//     try {
//       const length = parseHex(await _mission.getFeaturesLength());
//       const _features = [];
//       if (length > 0) {
//         for (let index = 0; index < length; index++) {
//           const _feature = await _mission.getFeature(index);

//           _features.push(_feature);
//         }
//       }

//       return _features;
//     } catch (error) {
//       return error;
//     }
//   }
// };

// export const _createContractMission = async (factoryCv, amount) => {
//   if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
//     try {
//       const address = await _getAccount();
//       const cv = await _signerContractCV(factoryCv, address);
//       const tx = await cv.buyMission(ADDR_FACTORY_MISSION, amount);
//       tx.wait();
//     } catch (error) {
//       return error;
//     }
//   }
// };
