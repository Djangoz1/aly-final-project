import testnetAddresses from "testnetaddresses.json";

import addresses from "../../address.json";

import testnetabis from "../../abistestnet.json";
import abis from "../../abis.json";
import { hardhat, sepolia } from "wagmi/chains";
import { hardhat as _hardhat, sepolia as _sepolia } from "viem/chains";

export const CONFIG = "TESTNET"; // "Testnet";
export const ABI_ADDRESS_SYSTEM = {
  LOCAL: abis.addressSystem,
  TESTNET: testnetabis.addressSystem,
}[CONFIG];
export const ABI_API_G = { LOCAL: abis.apiGet, TESTNET: testnetabis.apiGet }[
  CONFIG
];
export const ABI_API_P = { LOCAL: abis.apiPost, TESTNET: testnetabis.apiPost }[
  CONFIG
];
export const ABI_API_P_P = {
  LOCAL: abis.apiPostPayable,
  TESTNET: testnetabis.apiPostPayable,
}[CONFIG];

export const configs = {
  LOCAL: {
    pocketURL: "http://127.0.0.1:8090",
    addresses: addresses,
    abis: abis,
    chain: [hardhat],
    viemChain: _hardhat,
  },
  TESTNET: {
    pocketURL: "https://dework-db.fly.dev",
    addresses: testnetAddresses,
    abis: testnetabis,
    chain: [sepolia],
    viemChain: _sepolia,
  },
};
// module.exports = {
//   configs,
//   CONFIG,
// };
