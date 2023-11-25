"use client";

import React, { useEffect, useRef, useState } from "react";

import {
  doStateToolsMission,
  useToolsDispatch,
  useToolsState,
} from "context/tools";

import { _apiPost } from "utils/ui-tools/web3-tools";

import { useAuthState } from "context/auth";

import { Icon } from "@iconify/react";
import { icfy, icfyCODE, icfyETHER } from "icones";

import { _table_features } from "utils/states/tables/feature";
import { _table_invites } from "utils/works/feature";

import { _apiGet } from "utils/ui-tools/web3-tools";

import { ENUMS } from "constants/enums";

import { v4 } from "uuid";

import { MyCard, MyCardInfos } from "components/myComponents/card/MyCard";
import { LayoutMission } from "sections/Layout/layouts/LayoutMission";

import { MyScrolledXDiv } from "components/myComponents/box/MyScrolledXDiv";
import { CVName } from "components/inputs/inputsCV/CVName";
import { MyNum } from "components/myComponents/text/MyNum";
import { MyCountdown, MyCounter } from "components/myComponents/MyCountdown";
import { MyStatus } from "components/myComponents/item/MyStatus";
import { MyMainBtn } from "components/myComponents/btn/MyMainBtn";
import { STATUS } from "constants/status";
import { MENUS } from "constants/menus";
import { FeatureDispute } from "sections/works/Features/state/FeatureDispute";

function App({ params }) {
  const { cv } = useAuthState();

  const { state, status, pointer } = useToolsState();

  let [selectedID, setSelectedID] = useState(null);
  const missionID = params.missionID;
  console.log(state);
  let dispatch = useToolsDispatch();
  return (
    <LayoutMission
      controller={"escrows"}
      missionID={missionID}
      url={"/escrows"}
    >
      <MyScrolledXDiv>
        {state?.features?.map((el, i) => (
          <div
            onClick={() => setSelectedID(i === selectedID ? null : i)}
            className=""
            key={v4()}
          >
            <MyCard
              template={1}
              styles={
                "cursor-pointer min-w-[300px] h-full mr-2 px-3 py-4 flex flex-col"
              }
            >
              <div className="flex justify-between">
                <div className="flex flex-col">
                  <h6 className="font-semibold">{el?.metadatas?.title}</h6>
                  <div className="flex items-center c4">
                    <Icon icon={icfy.ux.admin} />
                    <CVName
                      styles={"font-light ml-2"}
                      metadata={state?.owner?.metadatas}
                      cvID={state?.owner?.cvID}
                    />
                  </div>
                  <div className="flex items-center c4">
                    <Icon icon={icfyCODE} />
                    <CVName
                      styles={"font-light ml-2"}
                      cvID={el?.datas?.cvWorker}
                    />
                  </div>
                </div>
                <span className="badge text-xs badge-accent">
                  {ENUMS.courts?.[el?.datas?.specification]?.court}
                </span>
              </div>

              <div className="flex mt-2 mb-3 justify-between">
                {el?.datas?.status !== 2 &&
                  el?.datas?.status !== 3 &&
                  (cv == state?.owner?.cvID || cv != el?.datas?.cvWorker) && (
                    <>
                      <MyNum num={el?.datas?.wadge}>
                        <Icon icon={icfyETHER} />
                      </MyNum>
                      <span className="text-[8px]">
                        <MyCounter
                          size={1}
                          endDate={parseInt(el?.datas?.startedAt)}
                          startDate={Date.now() / 1000}
                          end
                        />
                      </span>
                    </>
                  )}
              </div>
              <div className="w-full gap-2 items-center flex mt-auto">
                {el?.datas?.status !== 2 &&
                  el?.datas?.status !== 3 &&
                  (cv == state?.owner?.cvID || cv != el?.datas?.cvWorker) && (
                    <>
                      <MyMainBtn
                        url={"/create/escrow"}
                        style={"btn-xs"}
                        icon={{ no: true }}
                        color={3}
                        template={1}
                      >
                        Contest
                      </MyMainBtn>
                    </>
                  )}
                <MyStatus
                  style={"w-full  text-xs"}
                  status={el?.datas?.status}
                  target={"feature"}
                />
                {el?.datas?.status !== 2 &&
                  el?.datas?.status !== 3 &&
                  (cv == state?.owner?.cvID || cv != el?.datas?.cvWorker) && (
                    <>
                      <MyMainBtn
                        style={"btn-xs"}
                        icon={{ no: true }}
                        color={2}
                        template={1}
                        setter={async () => {
                          await _apiPost("validateFeature", [el?.featureID]);
                          doStateToolsMission({
                            dispatch,
                            missionID,
                            target: "features",
                          });
                        }}
                      >
                        Validate
                      </MyMainBtn>
                    </>
                  )}
              </div>
            </MyCard>
          </div>
        ))}
      </MyScrolledXDiv>

      <div className="flex gap-3 mt-10 flex-col px-3">
        {state?.escrows?.map((el) => (
          <FeatureDispute dispute={el} key={v4()} />
        ))}
      </div>
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
