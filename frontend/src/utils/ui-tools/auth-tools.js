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

  objectOwner.address = await _getterCV(cvAddress, "owner");
  objectOwner.name = await _getterCV(cvAddress, "name");

  let missionsLength = parseInt(
    await _getterCV(cvAddress, "getMissionsLength")
  );

  for (let index = 0; index < missionsLength; index++) {
    const missionAddr = await _getterCV(cvAddress, "getMission", [index]);

    objectOwner.missions.push(missionAddr);

    let _featuresLength = await _getterMISSION(
      missionAddr,
      "getFeaturesLength"
    );

    if (_featuresLength > 0) {
      for (let index = 0; index < _featuresLength; index++) {
        const feature = await _getterMISSION(missionAddr, "getFeature", [
          index,
        ]);
        objectOwner.amountDispersed += parseInt(feature.wadge);
      }
    }
  }

  return objectOwner;
};

export const _getStateOwnerMission = async (missionAddr) => {
  const owner = await _getterMISSION(missionAddr, "owner");

  const objectOwner = await _getStateOwnerByCv(owner);
  return objectOwner;
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
