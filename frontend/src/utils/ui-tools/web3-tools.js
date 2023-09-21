import { prepareWriteContract, writeContract, readContract } from "@wagmi/core";
import { ABI_API_P, ABI_API_G } from "constants/web3";
import { createPublicClient, http, parseAbiItem } from "viem";
import { hardhat } from "viem/chains";
import { ADDRESSES } from "constants/web3";

// ?----- viem client for events
export const viemClient = createPublicClient({
  chain: hardhat,
  transport: http(),
});

// *::::::::::::::: GLOBAL  :::::::::::::::*

export const setterCONTRACT = async (func, args) => {
  try {
    const { request } = await prepareWriteContract({
      address: ADDRESSES["apiPost"],
      abi: ABI_API_P,
      functionName: func,
      args: args,
    });
    const { hash } = await writeContract(request);

    return hash;
  } catch (error) {
    console.log("error", error);
  }
};

export const _apiGet = async (func, args) => {
  try {
    const res = await readContract({
      address: ADDRESSES["apiGet"],
      args: args,
      abi: ABI_API_G,
      functionName: func,
    });
    return res;
  } catch (error) {
    let _error = { error };
    console.log("error", { error }.error);
    return _error.details;
  }
};
export const _apiGetAt = async ({ func, args, address }) => {
  try {
    const res = await readContract({
      address: ADDRESSES[address],
      args: args,
      abi: ABI_API_G,
      functionName: func,
    });
    console.log("ress", res);
    return res;
  } catch (error) {
    let _error = { error };

    console.log("error", { error }.error);
    return _error.details;
  }
};
