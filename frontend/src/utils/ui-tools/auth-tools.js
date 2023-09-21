// import { fetchJSONByCID } from "./pinata-tools";
// import {
//   _getterCV,
//   _getterFeaturesHub,
//   _getterLaunchpadHub,
//   _getterMISSION,
//   _getterMissionsHub,
//   _getterPubsHub,
//   _apiGet,
// } from "./web3-tools";

// import { ethers } from "ethers";

// // // *::::::::::::::: PROVIDER :::::::::::::::*

// // // *::::::::::::::: FactoryCV :::::::::::::::*

// // *::::::::::::::: -- :::::::::::::::*
// // *::::::::::::::: CV :::::::::::::::*
// // *::::::::::::::: -- :::::::::::::::*

// export const _getStateOwnerByCv = async (cvAddress) => {
//   if (!cvAddress) return;
//   const objectOwner = {
//     cvAddress: cvAddress, //
//     cvID: 0, //
//     missions: [], //
//     features: [], //
//     pubs: [],
//     launchpads: [],
//     amountDispersed: 0,
//   };
//   let cvID = await _apiGet("cvOf", [cvAddress]);
//   objectOwner.cvID = cvID;

//   let featuresIndexer = await _apiGet("featuresOfCV", [cvID]);
//   objectOwner.pubs = await _apiGet("pubsOfCV", [cvID]);
//   objectOwner.missions = await _apiGet("missionsOfCV", [cvID]);
//   objectOwner.launchpads = await _apiGet("launchpadsOfCV", [cvID]);

//   // for (let index = 0; index < featuresIndexer?.length; index++) {
//   //   const id = parseInt(featuresIndexer[index]);
//   //   let featureDatas = await _getStateFeature(id);
//   //   let number = ethers.utils.formatEther(`${parseInt(featureDatas?.wadge)}`);
//   //   objectOwner.amountDispersed += parseFloat(number);
//   //   objectOwner.features.push(featureDatas);
//   // }

//   return objectOwner;
// };
