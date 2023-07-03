import { _getterCV, _getterMISSION } from "./web3-tools";

// // *::::::::::::::: PROVIDER :::::::::::::::*

// // *::::::::::::::: FactoryCV :::::::::::::::*

// *::::::::::::::: CV :::::::::::::::*

export const _getStateOwnerByCv = async (cvAddress) => {
  if (!cvAddress) return;
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

export const _getStateFeatures = async (missionAddr) => {
  const length = parseInt(
    await _getterMISSION(missionAddr, "getFeaturesLength")
  );
  const arr = [];
  for (let index = 0; index < length; index++) {
    const feature = await _getterMISSION(missionAddr, "getFeature", [index]);
    arr.push(feature);
  }

  return arr;
};

export const _getStateOwnerMission = async (missionAddr) => {
  const owner = await _getterMISSION(missionAddr, "owner");

  const objectOwner = await _getStateOwnerByCv(owner);
  return objectOwner;
};
