// import React, { useEffect, useState } from "react";

// // import {
// //   _getterFeaturesHub,
// //   _getterMissionsHub,
// // } from "utils/ui-tools/web3-tools";
// // import { _getMissionInfoState } from "utils/ui-tools/mission-tools";
// import { MyStat } from "components/myComponents/MyStat";
// import { v4 as uuidv4 } from "uuid";
// import { missionStats } from "constants/stats";

// export const MissionInfo = ({ missionId }) => {
//   const [metadata, setMetadata] = useState(null);

//   useEffect(() => {
//     (async () => {
//       const _metadata = await _getMissionInfoState(missionId);
//       setMetadata(_metadata);
//     })();
//   }, [missionId]);

//   const stats = missionStats(metadata);

//   return (
//     <>
//       <div className="stats shadow w-full">
//         {stats?.map((stat) => (
//           <MyStat values={stat?.values} key={uuidv4()} />
//         ))}
//       </div>
//       <div className="divider text-primary divider-primary">Description</div>
//       {metadata?.description}
//     </>
//   );
// };
