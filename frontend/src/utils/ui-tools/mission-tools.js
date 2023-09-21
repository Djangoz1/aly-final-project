import {
  _getterAccessControl,
  _getterFactoryMISSION,
  _getterFeaturesHub,
  _getterMissionsHub,
  _setterAccessControl,
  _setterFeaturesHub,
  _setterMISSION,
} from "./web3-tools";
import { _getStateOwnerByCv, _getStateOwnerMission } from "./auth-tools";
import {
  createFeatureOnPinata,
  createFileOnPinata,
  createMissionOnPinata,
  fetchJSONByCID,
} from "./pinata-tools";
import { ethers } from "ethers";

// *::::::::::::::: ------  :::::::::::::::* //
// *::::::::::::::: GETTER  :::::::::::::::* //
// *::::::::::::::: ------  :::::::::::::::* //

// export const _getAllMissionsState = async () => {
//   const length = parseInt(await _getterMissionsHub("getTokensLength"));

//   const arr = [];
//   for (let index = 1; index <= length; index++) {
//     const owner = await _getterMissionsHub("ownerOf", [index]);

//     if (owner) {
//       const state = await _getStateOwnerByCv(owner);
//       arr.push(state);
//     }
//   }
//   return arr;
// };

// export const _getMissionInfoState = async (missionId) => {
//   const tokenURI = await _getterMissionsHub("tokenURI", [missionId]);
//   const _metadata = await fetchJSONByCID(tokenURI);
//   _metadata.features = await _getterMissionsHub("getFeaturesIndexer", [
//     missionId,
//   ]);
//   let amount = 0;
//   for (let index = 0; index < _metadata.features.length; index++) {
//     const featureId = _metadata.features[index];
//     const featureData = await _getterFeaturesHub("getDatas", [featureId]);
//     amount += parseInt(featureData.wadge);
//   }
//   _metadata.owner = await _getterMissionsHub("ownerOf", [missionId]);
//   _metadata.totalAmount = ethers.utils.formatEther(amount.toString());
//   return _metadata;
// };

// // *::::::::::::::: ------  :::::::::::::::* //
// // *::::::::::::::: SETTER  :::::::::::::::* //
// // *::::::::::::::: ------  :::::::::::::::* //

// export const _createMission = async (datas) => {
//   let value = await _getterAccessControl("missionPrice");
//   let dataURI = await createMissionOnPinata(datas);

//   let tx = await _setterAccessControl(
//     "buyMission",
//     [dataURI],
//     `${parseInt(value)}`
//   );
// };

// export const _createFeature = async (missionID, datas) => {
//   let value = datas.wadge;

//   let dataURI = await createFeatureOnPinata(datas.metadata);
//   let Data = {
//     missionID: missionID,
//     startedAt: 0,
//     createdAt: 0,
//     wadge: datas.wadge,
//     estimatedDays: datas.estimatedDays,
//     status: 0,
//     tokenURI: dataURI,
//     isInviteOnly: datas.isInviteOnly,
//     assignedWorker: datas.assignedWorker,
//   };

//   await _setterAccessControl(
//     "postFeature",
//     [Data],
//     ethers.utils.parseEther(`${value}`)
//   );
// };
