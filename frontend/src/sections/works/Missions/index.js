// import { useEffect, useState } from "react";

// import {
//   _getStateOwnerByCv,
//   _getStateOwnerMission,
// } from "utils/ui-tools/auth-tools";

// import { v4 as uuid } from "uuid";

// import {
//   _getAllContractsMissionByFactory,
//   _getAllMissionsState,
// } from "utils/ui-tools/mission-tools";

// import { useAuthState } from "context/auth";
// // import { ObjStatsOwner } from "./obj";
// import Link from "next/link";

// import { ListStatsFeature } from "components/stats/lists/ListStatsFeature";
// import { Icon } from "@iconify/react";
// import { icfySEARCH, icfySEND } from "icones";

// export const Missions = () => {
//   const [ownersList, setOwnersList] = useState([]);

//   const { missions } = useAuthState();

//   useEffect(() => {
//     if (ownersList.length === 0) {
//       (async () => {
//         const list = await _getAllMissionsState();

//         setOwnersList(list);
//       })();
//     }
//   }, []);

//   return (
//     <div className="flex flex-col  mt-20   justify-center mx-auto">
//       <div className="flex  items-end">
//         <h4 className="text-black text-2xl font-black">Features</h4>
//         <div className="join ml-10">
//           <input
//             placeholder="Search Features"
//             className="input input-xs  join-item"
//           />
//           <div className="btn join-item btn-xs btn-primary ">
//             <Icon icon={icfySEARCH} className="text-white" />
//           </div>
//         </div>
//       </div>

//       <div className=" flex  flex-wrap w-full ">
//         {ownersList?.map((obj, index) => (
//           <ListStatsFeature
//             key={uuid()}
//             cvAddress={obj?.cvAddress}
//             link={true}
//           />
//         ))}
//       </div>
//       {/* // </Link> */}
//     </div>
//   );
// };
