import testnetAddresses from "testnetaddresses.json";

import addresses from "../../address.json";

import testnetabis from "../../abistestnet.json";
import abis from "../../abis.json";
import { hardhat, sepolia } from "wagmi/chains";
import { hardhat as _hardhat, sepolia as _sepolia } from "viem/chains";

export const CONFIG = "TESTNET"; // "TESTNET" || "LOCAL";

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
