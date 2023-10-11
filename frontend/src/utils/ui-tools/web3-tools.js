import { prepareWriteContract, writeContract, readContract } from "@wagmi/core";
import { ABI_API_P, ABI_API_G, ABIs } from "constants/web3";
import { createPublicClient, http, parseAbiItem } from "viem";
import { hardhat } from "viem/chains";
import { ADDRESSES } from "constants/web3";

// ?----- viem client for events
export const viemClient = createPublicClient({
  chain: hardhat,
  transport: http(),
});

// *::::::::::::::: GLOBAL  :::::::::::::::*

export const _apiPost = async (func, args, value) => {
  console.log("func ", func);
  console.log("args ", args);
  console.log("value ", value);
  try {
    const { request } = await prepareWriteContract({
      address: ADDRESSES["apiPost"],
      abi: ABI_API_P,
      functionName: func,
      args: args,
      value: value,
    });
    const { hash } = await writeContract(request);

    return hash;
  } catch (error) {
    console.log("error", error);
  }
};
export const _apiPostAt = async ({
  targetContract,
  func,
  args,
  address,
  value,
}) => {
  try {
    const { request } = await prepareWriteContract({
      address: address || ADDRESSES[targetContract],
      abi: ABIs[targetContract],
      functionName: func,
      args: args,
      value,
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
    console.log("error", { _error });
    return _error.details;
  }
};
export const _apiGetAt = async ({ func, args, targetContract, address }) => {
  try {
    const res = await readContract({
      address: address || ADDRESSES[targetContract],
      args: args,
      abi: ABIs[targetContract],
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
