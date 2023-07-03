import { _getterFactoryMISSION, _setterMISSION } from "./web3-tools";

// *::::::::::::::: GET MISSION  :::::::::::::::*

export const _getAllContractsMissionByFactory = async () => {
  const length = parseInt(await _getterFactoryMISSION("getMissionsLength"));

  const missions = [];
  for (let index = 0; index < length; index++) {
    const mission = await _getterFactoryMISSION("getMission", [index]);
    missions.push(mission);
  }

  return missions;
};

// *:::::::::::::::: Features ::::::::::::::::* //

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
