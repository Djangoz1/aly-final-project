import addresses from "../../../backend/addresses.json";
// import abi_f_mission from "../../../backend/artifacts/contracts/FactoryMission.sol/FactoryMission.json";
// import abi_mission from "../../../backend/artifacts/contracts/Mission.sol/Mission.json";

import abi_access_c from "../../../backend/artifacts/contracts/AccessControl.sol/AccessControl.json";
import abi_f_cv from "../../../backend/artifacts/contracts/SBToken/FactoryCV.sol/FactoryCV.json";

import abi_cv from "../../../backend/artifacts/contracts/SBToken/CV.sol/CV.json";
import abi_m_h from "../../../backend/artifacts/contracts/storage/MissionsHub.sol/MissionsHub.json";
import abi_f_h from "../../../backend/artifacts/contracts/storage/FeaturesHub.sol/FeaturesHub.json";

// export const ADDR_FACTORY_MISSION = address.ADDR_FACTORY_MISSION;
// export const ABI_MISSION = abi_mission.abi;

export const ABI_MISSIONS_HUB = abi_m_h.abi;
export const ABI_FEATURES_HUB = abi_f_h.abi;
export const ABI_ACCESS_CONTROL = abi_access_c.abi;
export const ABI_FACTORY_CV = abi_f_cv.abi;
export const ABI_CV = abi_cv.abi;

export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

export const ADDRESSES = addresses;
