// import { InputDescription } from "components/inputs/inputsMission/Description";
// import { ZERO_ADDRESS } from "constants/web3";
// import { useAuthState } from "context/auth";
// import { v4 as uuidv4 } from "uuid";

// import React, { useEffect, useState } from "react";
// import {
//   _getStateFeature,
//   _getStateFeatures,
//   _getStateOwnerByCv,
// } from "utils/ui-tools/auth-tools";
// import { _getFeatures, _setFeature } from "utils/ui-tools/mission-tools";
// import { _getterMissionsHub } from "utils/ui-tools/web3-tools";
// import { StatFeature } from "components/stats/StatFeature";
// import { MissionInfo } from "components/Mission";
// import { MyModal } from "components/modal/MyModal";

// export const CreationFeatures = () => {
//   const { missions, missionId } = useAuthState();
//   const { cv } = useAuthState();

//   const [features, setFeatures] = useState([]);
//   const [ownerObj, setOwnerObj] = useState(null);
//   const getFeatures = async () => {
//     setOwnerObj({ cvAddress: cv });
//     if (missions && missionId != null) {
//       const _features = await _getterMissionsHub("getFeaturesIndexer", [
//         missionId,
//       ]);
//       const arr = [];
//       for (let index = 0; index < _features.length; index++) {
//         const featureId = parseInt(_features[index]);
//         const featureData = await _getStateFeature(featureId);
//         arr.push(featureData);
//       }
//       setFeatures(arr);
//     }
//   };

//   useEffect(() => {
//     if (cv) {
//       getFeatures();
//     }
//   }, [missions, missionId]);
//   useEffect(() => {
//     if (cv) {
//       getFeatures();
//     }
//   }, [missions, missionId]);

//   return (
//     <div className="mt-4 flex flex-col">
//       <MissionInfo missionId={missionId} />

//       <div className="divider text-primary mt-[5vh]">Features</div>

//       <div className="mb-5 flex flex-wrap   w-fit">
//         {features?.map((feature, index) => (
//           <StatFeature obj={ownerObj} feature={feature} key={uuidv4()} />
//         ))}
//       </div>
//       <MyModal
//         btn={"Create"}
//         styles={{ btn: "w-fit btn-primary btn-sm ml-auto" }}
//         modal={<CreationFeature getter={getFeatures} />}
//       />
//     </div>
//   );
// };

// export const CreationFeature = ({ getter }) => {
//   let [datas, setDatas] = useState({
//     metadata: {
//       title: "",
//       image: "",
//       description: "",
//       devLanguage: "",
//       domain: "",
//       url: "",
//     },
//     estimatedDays: 0,
//     wadge: 0,
//     isInviteOnly: false,
//     assignedWorker: `${ZERO_ADDRESS}`,
//   });

//   return (
//     <>
//       <div className="flex justify-between">
//         <div className="flex flex-col">
//           <InputDescription getter={getter} datas={datas} setDatas={setDatas} />
//         </div>
//       </div>
//     </>
//   );
// };
