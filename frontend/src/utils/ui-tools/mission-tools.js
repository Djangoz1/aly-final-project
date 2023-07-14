import { recastDescription } from "utils/ux-tools";
import {
  _getterAccessControl,
  _getterFactoryMISSION,
  _getterMissionsHub,
  _setterAccessControl,
  _setterMISSION,
} from "./web3-tools";
import { _getStateOwnerByCv, _getStateOwnerMission } from "./auth-tools";
import { createFileOnPinata } from "./pinata-tools";
import { ethers } from "ethers";
// *::::::::::::::: GET MISSION  :::::::::::::::*

export const _getAllMissionsState = async () => {
  const length = parseInt(await _getterMissionsHub("getTokensLength"));

  const arr = [];
  for (let index = 0; index < length; index++) {
    const owner = await _getterMissionsHub("ownerOf", [index]);
    if (owner) {
      const state = await _getStateOwnerByCv(owner);
      arr.push(state);
    }
  }
  return arr;
};

// *:::::::::::::::: Features ::::::::::::::::* //

export const _createMission = async (datas) => {
  let value = await _getterAccessControl("missionPrice");
  let dataURI = await createFileOnPinata(datas);
  console.log("data", dataURI);
  let tx = await _setterAccessControl(
    "buyMission",
    [dataURI],
    `${parseInt(value)}`
  );
  console.log(tx);
};
