import address from "../../../backend/constants/address";
import abi_f_mission from "../../../backend/artifacts/contracts/FactoryMission.sol/FactoryMission.json";
import abi_mission from "../../../backend/artifacts/contracts/Mission.sol/Mission.json";

import abi_f_cv from "../../../backend/artifacts/contracts/SBToken/FactoryCV.sol/FactoryCV.json";
import abi_cv from "../../../backend/artifacts/contracts/SBToken/CV.sol/CV.json";

export const ADDR_LENS_HUB_PROXY = "0x60Ae865ee4C725cd04353b5AAb364553f56ceF82";

export const ADDR_FACTORY_MISSION = address.ADDR_FACTORY_MISSION;
export const ABI_FACTORY_MISSION = abi_f_mission.abi;
export const ABI_MISSION = abi_mission.abi;

export const ADDR_FACTORY_CV = address.ADDR_FACTORY_CV;
export const ABI_FACTORY_CV = abi_f_cv.abi;
export const ABI_CV = abi_cv.abi;

export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
