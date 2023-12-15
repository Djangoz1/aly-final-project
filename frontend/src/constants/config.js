import testnetAddresses from "testnetaddresses.json";
import addresses from "../../../backend/addresses.json";
import testnetabis from "testnetabis.json";
import { hardhat, sepolia } from "wagmi/chains";
import { hardhat as _hardhat, sepolia as _sepolia } from "viem/chains";

import abi_addr_s from "../../../backend/artifacts/contracts/system/AddressSystem.sol/AddressSystem.json";
import abi_api_g from "../../../backend/artifacts/contracts/system/APIGet.sol/APIGet.json";
import abi_cvh from "../../../backend/artifacts/contracts/cv/CVsHub.sol/CVsHub.json";
import abi_api_p from "../../../backend/artifacts/contracts/system/APIPost.sol/APIPost.json";
import abi_api_p_p from "../../../backend/artifacts/contracts/system/APIPostPayable.sol/APIPostPayable.json";
import abi_bh from "../../../backend/artifacts/contracts/system/BalancesHub.sol/BalancesHub.json";
import abi_l from "../../../backend/artifacts/contracts/launchpads/Launchpad.sol/Launchpad.json";
import abi_erc20 from "../../../backend/artifacts/@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol/IERC20Metadata.json";

export const CONFIG = "LOCAL"; // "Testnet";
export const ABI_ADDRESS_SYSTEM = abi_addr_s.abi;
export const ABI_API_G = abi_api_g.abi;
export const ABI_API_P = abi_api_p.abi;
export const ABI_API_P_P = abi_api_p_p.abi;
export const configs = {
  LOCAL: {
    pocketURL: "http://127.0.0.1:8090",
    addresses: addresses,
    abis: {
      cvsHub: abi_cvh.abi,
      balancesHub: abi_bh.abi,
      apiGet: abi_api_g.abi,
      launchpad: abi_l.abi,
      apiPostPayable: abi_api_p_p.abi,
      erc20: abi_erc20.abi,
    },
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
