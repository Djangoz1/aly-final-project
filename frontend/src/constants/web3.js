import addresses from "../../../backend/addresses.json";

import abi_access_c from "../../../backend/artifacts/contracts/AccessControl.sol/AccessControl.json";
import abi_f_cv from "../../../backend/artifacts/contracts/SBToken/FactoryCV.sol/FactoryCV.json";

import abi_cv from "../../../backend/artifacts/contracts/SBToken/CV.sol/CV.json";
import abi_m_h from "../../../backend/artifacts/contracts/storage/MissionsHub.sol/MissionsHub.json";
import abi_p_h from "../../../backend/artifacts/contracts/storage/PubsHub.sol/PubsHub.json";
import abi_f_h from "../../../backend/artifacts/contracts/storage/FeaturesHub.sol/FeaturesHub.json";
import abi_l_h from "../../../backend/artifacts/contracts/storage/LaunchpadHub.sol/LaunchpadHub.json";
import abi_l from "../../../backend/artifacts/contracts/launchpad/Launchpad.sol/Launchpad.json";
import abi_erc20 from "../../../backend/artifacts/contracts/ERC20/ERC20Token.sol/ERC20Token.json";

export const ABI_MISSIONS_HUB = abi_m_h.abi;
export const ABI_PUBS_HUB = abi_p_h.abi;
export const ABI_FEATURES_HUB = abi_f_h.abi;
export const ABI_ACCESS_CONTROL = abi_access_c.abi;
export const ABI_FACTORY_CV = abi_f_cv.abi;
export const ABI_CV = abi_cv.abi;
export const ABI_LAUNCHPAD_HUB = abi_l_h.abi;
export const ABI_LAUNCHPAD = abi_l.abi;
export const ABI_ERC20 = abi_erc20.abi;

export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

export const ADDRESSES = addresses;
