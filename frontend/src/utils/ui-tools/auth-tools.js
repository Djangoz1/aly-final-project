import { fetchJSONByCID } from "./pinata-tools";
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

  let featuresIndexer = await _getterFeaturesHub("getIndexer", [cvAddress]);

  objectOwner.missions = await _getterMissionsHub("getIndexer", [cvAddress]);

  for (let index = 0; index < featuresIndexer.length; index++) {
    const id = parseInt(featuresIndexer[index]);
    let featureDatas = await _getStateFeature(id);
    objectOwner.amountDispersed += ethers.utils.formatEther(
      `${parseInt(featureDatas?.wadge)}`
    );

    objectOwner.features.push(featureDatas);
  }

  return objectOwner;
};

export const _getStateFeature = async (id) => {
  let featureDatas = await _getterFeaturesHub("getDatas", [id]);
  const metadata = await fetchJSONByCID(featureDatas?.tokenURI);

  featureDatas.id = id;
  featureDatas.metadata = metadata;
  return featureDatas;
};
