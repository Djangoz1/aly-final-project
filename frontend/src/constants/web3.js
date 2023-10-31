import addresses from "../../../backend/addresses.json";

import abi_addr_s from "../../../backend/artifacts/contracts/system/AddressSystem.sol/AddressSystem.json";
import abi_api_g from "../../../backend/artifacts/contracts/system/APIGet.sol/APIGet.json";
import abi_cvh from "../../../backend/artifacts/contracts/cv/CVsHub.sol/CVsHub.json";
import abi_api_p from "../../../backend/artifacts/contracts/system/APIPost.sol/APIPost.json";
import abi_bh from "../../../backend/artifacts/contracts/system/BalancesHub.sol/BalancesHub.json";
import abi_l from "../../../backend/artifacts/contracts/launchpads/Launchpad.sol/Launchpad.json";
// import abi_erc20 from "../../../backend/artifacts/contracts/ERC20/ERC20Token.sol/ERC20Token.json";
import abi_erc20 from "../../../backend/artifacts/@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol/IERC20Metadata.json";
export const ABI_ADDRESS_SYSTEM = abi_addr_s.abi;
export const ABI_API_G = abi_api_g.abi;
export const ABI_API_P = abi_api_p.abi;

export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

export const ABIs = {
  cvsHub: abi_cvh.abi,
  balancesHub: abi_bh.abi,
  launchpad: abi_l.abi,
  erc20: abi_erc20.abi,
};

export const ADDRESSES = addresses;
