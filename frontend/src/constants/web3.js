import addresses from "../../../backend/addresses.json";

import abi_addr_s from "../../../backend/artifacts/contracts/system/AddressSystem.sol/AddressSystem.json";
import abi_api_g from "../../../backend/artifacts/contracts/system/APIGet.sol/APIGet.json";
import abi_api_p from "../../../backend/artifacts/contracts/system/APIPost.sol/APIPost.json";

export const ABI_ADDRESS_SYSTEM = abi_addr_s.abi;
export const ABI_API_G = abi_api_g.abi;
export const ABI_API_P = abi_api_p.abi;

export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

export const ADDRESSES = addresses;
