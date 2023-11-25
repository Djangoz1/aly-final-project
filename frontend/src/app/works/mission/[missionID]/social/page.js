"use client";

import React, { useEffect, useRef, useState } from "react";

import {
  doStateMissionTools,
  useToolsDispatch,
  useToolsState,
} from "context/tools";

import { _apiPost } from "utils/ui-tools/web3-tools";

import { Avatar, ProfileAvatar } from "components/profile/ProfileAvatar";

import { useAuthState } from "context/auth";

import { Icon } from "@iconify/react";
import {
  icfy,
  icfyCODE,
  icfyETHER,
  icfyMAIL,
  icfySEND,
  icsystem,
} from "icones";

import { MyLayoutApp } from "components/myComponents/layout/MyLayoutApp";
import { _table_features } from "utils/states/tables/feature";
import { _table_invites } from "utils/works/feature";

import { Viewport } from "components/myComponents/layout/MyViewport";
import { CVProfile } from "sections/Profile/state/CVProfile";
import { _apiGet } from "utils/ui-tools/web3-tools";
import { ADDRESSES } from "constants/web3";
import { MyModal } from "components/myComponents/modal/MyModal";
import { ImagePin } from "components/Image/ImagePin";
import { CVOverview } from "sections/Profile/state/CVOverview";
import { ENUMS } from "constants/enums";
import { EditProfile } from "sections/Form/forms/edit/EditProfile";
import { AssetProfile1 } from "components/assets/AssetProfile";
import { MyFModal } from "components/myComponents/modal/MyFramerModal";
import { CreatePub } from "sections/Pub/form/create/CreatePub";
import { v4 } from "uuid";
import { EditWorker } from "sections/works/Features/form/edit/EditWorker";
import { CVInfos } from "sections/Profile/state/CVInfos";
import {
  MyMenusDropdown,
  MyMenusDropdownProfile,
  MyMenusTabs,
} from "components/myComponents/menu/MyMenus";
import { CVMenusDropdown } from "sections/Profile/state/CVMenusDropdown";
import { BtnsSocial } from "components/btn/BtnsSocial";
import { Loader } from "@react-three/drei";
import { MyLoader } from "components/myComponents/layout/MyLoader";
import { MyCardList } from "components/myComponents/card/MyCardList";
import { doStateFormPointer } from "context/form";
import { MyLayoutDashboard } from "components/myComponents/layout/MyLayoutDashboard";
import { STATUS } from "constants/status";

import { MyCardFolder } from "components/myComponents/card/MyCardFolder";
import { MyFramerModal } from "components/myComponents/box/MyFramerModals";
import { MyCard } from "components/myComponents/card/MyCard";
import { LayoutProfile } from "sections/Layout/layouts/LayoutProfile";
import { MENUS } from "constants/menus";
import { LayoutMission } from "sections/Layout/layouts/LayoutMission";
import { MySub } from "components/myComponents/text/MySub";
import { MissionProfile } from "sections/works/Missions/state/MissionProfile";
import { AgendasMission } from "sections/works/Missions/state/AgendasMission";
import { MissionFeatures } from "sections/works/Missions/state/MissionFeatures";
import { MissionPubs } from "sections/works/Missions/state/MissionPubs";

function App({ params }) {
  const { cv } = useAuthState();

  const { state, status, pointer } = useToolsState();
  let [isLoading, setIsLoading] = useState(null);
  let [isState, setIsState] = useState(null);

  const missionID = params.missionID;

  let dispatch = useToolsDispatch();

  return (
    <LayoutMission controller={"pubs"} missionID={missionID} url={"/social"}>
      {/* <MissionFeatures index={state?.front?.props} /> */}
      <MissionPubs />
    </LayoutMission>
  );
}

export default App;

// "use client";

// function App({ params }) {
//   const { cv } = useAuthState();

//   const tools = useToolsState();
//   const { state, pointer } = useToolsState();

//   let [isState, setIsState] = useState(null);
//   let [loading, setLoading] = useState(null);
//   let dispatch = useToolsDispatch();
//   let fetch = async () => {
//     setLoading(true);
// let _state = await doStateMissionTools(dispatch, parseInt(missionID));
//     setIsState(_state);
//     setLoading(false);
//   };
//   useEffect(() => {
//     if (!isState) {
//       fetch();
//       console.log("Origine !!! fetch mission state", isState);
//     }
//   }, [missionID]);

//   let askToJoin = async (featureID) => {
//     console.log("askToJoin", askToJoin);
//     await _apiPost("askToJoin", [parseInt(featureID)]);
//     await doStateMissionTools(dispatch, parseInt(featureID));
//   };
//   console.log(state);
//   return (
//     <MyLayoutDashboard
//       // setter={askToJoin}

//       id={missionID}
//       allowed={
//         cv == state?.mission?.datas?.owner &&
//         state?.mission?.datas?.status === 0
//       }
//       refresh={() => doStateMissionTools(dispatch, state?.mission?.missionID)}
//       template={0}
//       isLoading={loading}
//       header={state?.mission?.metadatas?.title}
//       statusObj={{
//         current: state?.mission?.datas?.status,
//         to: 1,
//       }}
//       price={state?.mission?.datas?.amount || 0}
//       owner={{ ...state?.owner?.metadatas, cvID: state?.owner?.cvID }}
//       url={`/works/mission/${missionID}`}
//       btn={{
//         title: cv == state?.owner?.cvID ? "New feature" : "Ask to join",
//         info: <>Lorem ipsum dolor sit, amet consectetur adipisicing elit.</>,
//         url: cv == state?.owner?.cvID ? "/create/feature" : "#section2",
//       }}
//       // ownerProfile={
//       //   loading ? null : <AssetProfileCard />
//       //   // <AssetProfile1
//       //   //   style={"w-full"}
//       //   //   noBtn={true}
//       //   //   cvID={isState?.mission?.datas?.owner}
//       //   //   target={"owner"}
//       //   // />
//       // }

//
//     >
//       <div className=" w-full relative">
//         {/* <Viewport
//             img={state?.mission?.metadatas?.attributes?.[0]?.banniere}
//             id={"home"}
//             full={true}
//             index={null}
//           > */}

//         {/* */}
//         {
//           [
//             <div className=""></div>,
//           ]?.[pointer]
//         }
//         {/*

//           <div className="fixed z-100 bottom-20   flex flex-col items-end h-fit right-10">
//             <CreatePub
//               style={" bottom-20 btn c2 btn-xs btn-outline flex h-fit mb-2 "}
//               missionID={missionID}
//               btn={<Icon icon={icfy?.msg?.chat} className="text-2xl m-4" />}
//             />
//             <div className="flex  mt-2">
//               {state?.features?.[tools?.index]?.datas?.cvWorker == 0 &&
//                 tools?.pointer == 2 &&
//                 state?.features?.[tools?.index]?.datas?.owner != cv && (
//                   <MyFModal
//                     btns={{ btn: "Join feature", submit: "Confirm" }}
//                     submit={() =>
//                       askToJoin(
//                         state?.features?.[tools?.index]?.featureID
//                       )
//                     }
//                     styles={{ btn: "btn btn-xs c2 btn-outline " }}
//                   >
//                     <div className="min-h-[20vh]">
//                       <p className="text-xs">
//                         Êtes-vous sûre de vouloir demander à travailler pour
//                         <span className="text-success">
//                           {
//                             state?.features?.[tools?.index]?.metadatas
//                               ?.title
//                           }
//                           ?{" "}
//                         </span>
//                       </p>
//                       <div className="flex flex-col">
//                         <span className="text-white/60  text-[10px]">
//                           Si l'owner accepte votre proposition, vous serez
//                           désigner automatiquement comme le worker.
//                         </span>
//                         <span className="text-white/60  text-[10px]">
//                           Please be sure to be available for this task.
//                         </span>
//                       </div>
//                     </div>
//                   </MyFModal>
//                 )}

//               {state?.mission?.datas?.status === 0 &&
//                 state?.owner?.cvID == cv && (
//                   <MyFModal
//                     submit={closeMission}
//                     styles={{ btn: "btn btn-xs ml-4 btn-error" }}
//                     btns={{ btn: "Close Mission", submit: "Valider" }}
//                   >
//                     <div className="min-h-[20vh]">
//                       <p className="text-xs">
//                         Êtes-vous sûre de vouloir{" "}
//                         <span className="text-error">fermer la mission ? </span>
//                       </p>
//                       <div className="flex flex-col">
//                         <span className="text-white/60  text-[10px]">
//                           Si vous accepter, cette mission ne pourras plus créer
//                           de nouvelles features.
//                         </span>
//                         <span className="text-white/60  text-[10px]">
//                           Les features en cours convervent leurs modalités et
//                           peuvent aller jusqu'à leurs termes.
//                         </span>
//                       </div>
//                     </div>
//                   </MyFModal>
//                 )}

//               {state?.mission?.datas?.status === 0 &&
//                 state?.owner?.cvID == cv && (
//                   <Link
//                     href={"/create/feature"}
//                     className="btn btn-xs c2 ml-4 "
//                   >
//                     Create feature
//                   </Link>
//                 )}
//             </div>
//           </div> */}
//       </div>
//     </MyLayoutDashboard>
//   );
// }

// export default App;
