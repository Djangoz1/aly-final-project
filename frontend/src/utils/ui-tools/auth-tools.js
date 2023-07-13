import {
  _getterCV,
  _getterFeaturesHub,
  _getterMISSION,
  _getterMissionsHub,
} from "./web3-tools";

import { ethers } from "ethers";

// // *::::::::::::::: PROVIDER :::::::::::::::*

// // *::::::::::::::: FactoryCV :::::::::::::::*

// *::::::::::::::: -- :::::::::::::::*
// *::::::::::::::: CV :::::::::::::::*
// *::::::::::::::: -- :::::::::::::::*

export const _getStateOwnerByCv = async (cvAddress) => {
  if (!cvAddress) return;
  const objectOwner = {
    cvAddress: cvAddress, //
    address: "", //
    missions: [], //
    features: [], //
    amountDispersed: 0,
  };
  objectOwner.address = await _getterCV(cvAddress, "owner");

  objectOwner.features = await _getterFeaturesHub("getIndexer", [cvAddress]);

  objectOwner.missions = await _getterMissionsHub("getIndexer", [cvAddress]);

  for (let index = 0; index < objectOwner.features.length; index++) {
    const id = parseInt(objectOwner.features[index]);
    let datas = await _getterFeaturesHub("getDatas", [id]);
    objectOwner.amountDispersed += ethers.utils.formatEther(
      `${parseInt(datas?.wadge)}`
    );
  }

  return objectOwner;
};

export const _getStateFeature = async (id) => {
  const datas = await _getterFeaturesHub("getDatas", [id]);
  return datas;
};

export const _getStateOwnerMission = async (missionAddr) => {
  const owner = await _getterMISSION(missionAddr, "owner");

  const objectOwner = await _getStateOwnerByCv(owner);
  return objectOwner;
};
