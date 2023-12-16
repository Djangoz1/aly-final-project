export const ABI_ADDRESS_SYSTEM = configs[CONFIG].abis.addressSystem;
export const ABI_API_G = configs[CONFIG].abis.apiGet;
export const ABI_API_P = configs[CONFIG].abis.apiPost;
export const ABI_API_P_P = configs[CONFIG].abis.apiPostPayable;

export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

import { CONFIG, configs } from "./config.js";
export const ADDRESSES = { ...configs[CONFIG].addresses };
export const ABIs = { ...configs[CONFIG].abis };
