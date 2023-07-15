import { prepareWriteContract, writeContract, readContract } from "@wagmi/core";
import {
  ABI_CV,
  ABI_FACTORY_CV,
  ABI_ACCESS_CONTROL,
  ABI_MISSIONS_HUB,
  ABI_FEATURES_HUB,
  ABI_PUBS_HUB,
} from "constants/web3";
import { createPublicClient, http, parseAbiItem } from "viem";
import { hardhat } from "viem/chains";
import { ADDRESSES } from "constants/web3";

// ?----- viem client for events
export const viemClient = createPublicClient({
  chain: hardhat,
  transport: http(),
});

// *::::::::::::::: GLOBAL  :::::::::::::::*

export const _setterCONTRACT = async ({ funcName, args, addr, abi }) => {
  try {
    const { request } = await prepareWriteContract({
      address: addr,
      abi: abi,
      functionName: funcName,
      args: args,
    });
    const { hash } = await writeContract(request);

    return hash;
  } catch (error) {
    console.log("error", error);
  }
};

export const _getterCONTRACT = async ({ functionName, args, addr, abi }) => {
  try {
    const res = await readContract({
      address: addr,
      args: args,
      abi: abi,
      functionName: functionName,
    });
    return res;
  } catch (error) {
    console.log("error", error);
  }
};

// *::::::::::::::: ---------------  :::::::::::::::* //
// *::::::::::::::: PUBLICATION HUB  :::::::::::::::* //
// *::::::::::::::: ---------------  :::::::::::::::* //

export const _setterPubsHub = async (funcName, args, value) => {
  try {
    const { request } = await prepareWriteContract({
      address: ADDRESSES["pubsHub"],
      abi: ABI_PUBS_HUB,
      functionName: funcName,
      args: args,
      value: value,
    });
    const { hash } = await writeContract(request);

    return hash;
  } catch (error) {
    console.log("error", error);
  }
};

export const _getterPubsHub = async (funcName, args) => {
  try {
    const res = await readContract({
      address: ADDRESSES["pubsHub"],
      abi: ABI_PUBS_HUB,
      args: args,
      functionName: funcName,
    });
    return res;
  } catch (error) {
    console.log("error", { error });
  }
};

// *::::::::::::::: --------------  :::::::::::::::* //
// *::::::::::::::: ACCESS CONTROL  :::::::::::::::* //
// *::::::::::::::: --------------  :::::::::::::::* //

export const _setterAccessControl = async (funcName, args, value) => {
  try {
    const { request } = await prepareWriteContract({
      address: ADDRESSES["accessControl"],
      abi: ABI_ACCESS_CONTROL,
      functionName: funcName,
      args: args,
      value: value,
    });
    const { hash } = await writeContract(request);

    return hash;
  } catch (error) {
    console.log("error", error);
  }
};

export const _getterAccessControl = async (funcName, args) => {
  try {
    const res = await readContract({
      address: ADDRESSES["accessControl"],
      args: args,
      abi: ABI_ACCESS_CONTROL,
      functionName: funcName,
    });
    return res;
  } catch (error) {
    console.log("error", error);
  }
};
// *::::::::::::::: -----------  :::::::::::::::* //
// *::::::::::::::: MISSION HUB  :::::::::::::::* //
// *::::::::::::::: -----------  :::::::::::::::* //

export const _setterMissionHub = async (funcName, args) => {
  try {
    const hash = await _setterCONTRACT({
      funcName,
      args,
      addr: ADDRESSES["MissionsHub"],
      abi: ABI_MISSIONS_HUB,
    });
    return hash;
  } catch (error) {
    console.log("error", error);
  }
};

export const _getterMissionsHub = async (funcName, args) => {
  const res = await readContract({
    address: ADDRESSES["missionsHub"],
    abi: ABI_MISSIONS_HUB,
    args: args,
    functionName: funcName,
  });
  return res;
};

// *::::::::::::::: ------------  :::::::::::::::* //
// *::::::::::::::: FEATURES HUB  :::::::::::::::* //
// *::::::::::::::: ------------  :::::::::::::::* //

export const _setterFeaturesHub = async (funcName, args) => {
  try {
    const hash = await _setterCONTRACT({
      funcName,
      args,
      addr: ADDRESSES["featuresHub"],
      abi: ABI_FEATURES_HUB,
    });
    return hash;
  } catch (error) {
    console.log("error", error);
  }
};

export const _getterFeaturesHub = async (funcName, args) => {
  try {
    const res = await readContract({
      address: ADDRESSES["featuresHub"],
      args: args,
      abi: ABI_FEATURES_HUB,
      functionName: funcName,
    });
    return res;
  } catch (error) {
    console.log("error", error);
  }
};

// *::::::::::::::: ------  :::::::::::::::* //
// *::::::::::::::: F & CV  :::::::::::::::* //
// *::::::::::::::: ------  :::::::::::::::* //

export const _setterFactoryCV = async (funcName, args) => {
  try {
    const hash = await _setterCONTRACT({
      funcName,
      args,
      addr: ADDR_FACTORY_CV,
      abi: ABI_FACTORY_CV,
    });
    return hash;
  } catch (error) {
    console.log("error", error);
  }
};

export const _getterFactoryCV = async (funcName, args) => {
  try {
    const res = await readContract({
      address: ADDRESSES["factoryCV"],
      args: args,
      abi: ABI_FACTORY_CV,
      functionName: funcName,
    });
    return res;
  } catch (error) {
    console.log("error", error);
  }
};

export const _setterCV = async (addr, funcName, args) => {
  try {
    const { request } = await prepareWriteContract({
      address: addr,

      functionName: funcName,
      abi: ABI_CV,
      args: args,
    });
    const { hash } = await writeContract(request);

    return hash;
  } catch (error) {
    console.log("error", error);
  }
};

export const _getterCV = async (addr, funcName, args) => {
  try {
    const res = await readContract({
      address: addr,
      args: args,
      abi: ABI_CV,
      functionName: funcName,
    });
    return res;
  } catch (error) {
    console.log("error", error);
  }
};
