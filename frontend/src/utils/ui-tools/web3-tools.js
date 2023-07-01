import { prepareWriteContract, writeContract, readContract } from "@wagmi/core";
import {
  ABI_CV,
  ABI_FACTORY_CV,
  ABI_FACTORY_MISSION,
  ABI_MISSION,
  ADDR_FACTORY_CV,
  ADDR_FACTORY_MISSION,
} from "constants/web3";
import { createPublicClient, http, parseAbiItem } from "viem";
import { hardhat } from "viem/chains";

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

// *::::::::::::::: F & MISSION  :::::::::::::::*

export const _setterFactoryMISSION = async (funcName, args) => {
  try {
    const hash = await _setterCONTRACT({
      funcName,
      args,
      addr: ADDR_FACTORY_MISSION,
      abi: ABI_FACTORY_MISSION,
    });
    return hash;
  } catch (error) {
    console.log("error", error);
  }
};

export const _getterFactoryMISSION = async (funcName, args) => {
  try {
    const res = await readContract({
      address: ADDR_FACTORY_MISSION,
      args: args,
      abi: ABI_FACTORY_MISSION,
      functionName: funcName,
    });
    return res;
  } catch (error) {
    console.log("error", error);
  }
};

export const _setterMISSION = async (addr, funcName, args) => {
  try {
    const { request } = await prepareWriteContract({
      address: addr,

      abi: ABI_MISSION,
      functionName: funcName,
      args: args,
    });
    const { hash } = await writeContract(request);

    return hash;
  } catch (error) {
    console.log("error", error);
  }
};

export const _getterMISSION = async (addr, funcName, args) => {
  try {
    const res = await readContract({
      address: addr,
      args: args,
      abi: ABI_MISSION,
      functionName: funcName,
    });
    return res;
  } catch (error) {
    console.log("error", error);
  }
};

// *::::::::::::::: F & CV  :::::::::::::::*

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
      address: ADDR_FACTORY_CV,
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
