import { recastDescription } from "utils/ux-tools";
import {
  _getterFactoryMISSION,
  _getterMissionsHub,
  _setterMISSION,
} from "./web3-tools";

// *::::::::::::::: GET MISSION  :::::::::::::::*

// export const _getAllContractsMissionByFactory = async () => {
//   const length = parseInt(await _getterMissionsHub("getTokensLength"));

//   const missions = [];
//   for (let index = 0; index < length; index++) {
//     const mission = await _getterFactoryMISSION("getMission", [index]);
//     missions.push(mission);
//   }

//   return missions;
// };

// *:::::::::::::::: Features ::::::::::::::::* //

export const _setFeature = async (missionAddr, feature) => {
  try {
    let { estimatedDay, wadge, description, assignedWorker, inviteOnly } =
      feature;
    const _description =
      "__/title:" +
      description?.title +
      "__/dev:" +
      description?.dev +
      "__/domain:" +
      description.domain +
      "__/desc:" +
      description.desc;

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
