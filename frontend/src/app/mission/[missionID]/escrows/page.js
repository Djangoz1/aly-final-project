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
import { icfy, icfyCODE, icfyETHER, icsystem } from "icones";

import { _table_features } from "utils/states/tables/feature";
import { _table_invites } from "utils/works/feature";

import { _apiGet } from "utils/ui-tools/web3-tools";

import { ENUMS } from "constants/enums";

import { v4 } from "uuid";

import { MyCard, MyCardInfos } from "components/myComponents/card/MyCard";
import { LayoutMission } from "sections/Layout/layouts/LayoutMission";

import { MyScrolledXDiv } from "components/myComponents/box/MyScrolledXDiv";
import { CVName } from "components/links/CVName";
import { MyNum } from "components/myComponents/text/MyNum";
import { MyCountdown, MyCounter } from "components/myComponents/MyCountdown";
import { MyStatus } from "components/myComponents/item/MyStatus";
import { MyMainBtn } from "components/myComponents/btn/MyMainBtn";
import { STATUS } from "constants/status";
import { MENUS } from "constants/menus";
import { FeatureDispute } from "sections/works/Features/state/FeatureDispute";
import { MyCardDropdown } from "components/myComponents/card/MyCardDropdown";
import { MySub } from "components/myComponents/text/MySub";
import { MyBadge } from "components/myComponents/box/MyList";
import { MissionName } from "components/links/MissionName";

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
        {state?.escrows?.map((el, i) => (
          <MyCardDropdown
            styleClick={" min-w-[60vw] h-fit "}
            style={" h-fit min-w-fit max-w-[60vw] "}
            key={v4()}
            header={
              <>
                <Icon icon={icfy.ux.admin} className="c4 text-lg mr-2" />
                <MySub size={"8"}>
                  <CVName cvID={el?.datas?.payerID} />
                </MySub>
                <Icon icon={icsystem?.feature} className="c4 text-lg mx-2" />
                <MySub size={"8"}>
                  <CVName cvID={el?.datas?.payeeID} />
                </MySub>
                <Icon
                  icon={icfy.bank.dollars}
                  className="c4 text-lg ml-4 mr-2"
                />
                <MySub style={"flex gap-1 items-start"} size={"9"}>
                  <MyNum num={el?.datas?.value} />
                  <span className="c4">ETH</span>
                </MySub>
              </>
            }
            footer={
              <div className="w-full gap-2 items-center flex mt-auto">
                <MyStatus
                  padding={"px-2 py-1 "}
                  style={"w-full  text-[9px]"}
                  status={el?.datas?.rules?.status}
                  target={"dispute"}
                />
              </div>
            }
            title={el?.metadatas?.title}
          >
            <MyCardInfos
              template={6}
              title={"Escrow datas"}
              arr={[
                { title: "Created", value: el?.metadatas?.created },
                {
                  title: "Mission",
                  value: (
                    <MissionName
                      missionHash={
                        el?.metadatas?.["@expand"]?.featureID?.missionID
                      }
                    ></MissionName>
                  ),
                },
                { title: "reason", value: el?.metadatas?.description },
                {
                  title: "evidence",
                  value: (
                    <article className="whitespace-break-spaces">
                      {el?.metadatas?.["@expand"]?.featureID?.abstract ? (
                        <>
                          {el?.metadatas?.["@expand"]?.featureID?.abstract}
                          <br />
                        </>
                      ) : (
                        <> </>
                      )}
                      {el?.metadatas?.["@expand"]?.featureID?.description}
                    </article>
                  ),
                },
                {
                  title: "Domain",
                  value: (
                    <MyBadge
                      color={el?.metadatas?.["@expand"]?.featureID?.domain}
                      className="whitespace-break-spaces"
                    >
                      {
                        ENUMS.domain[
                          el?.metadatas?.["@expand"]?.featureID?.domain
                        ]?.name
                      }
                    </MyBadge>
                  ),
                },
                {
                  title: "skills required",
                  value: (
                    <div className="flex flex-wrap gap-4 w-1/2">
                      {el?.metadatas?.["@expand"]?.featureID?.skills?.map(
                        (el, i) => (
                          <MyBadge style={"text-[8px]"} color={i} key={v4()}>
                            {el}
                          </MyBadge>
                        )
                      )}
                    </div>
                  ),
                },
                {
                  title: "appeal",

                  value: <MySub>{`${el?.datas?.rules?.appeal}`}</MySub>, // el?.datas?.rules?.appeal}</MySub>,
                },
                {
                  title: "Période d'appel",
                  value: (
                    <MySub style={"text-xs"}>
                      {el?.datas?.reclamationPeriod} Days
                    </MySub>
                  ),
                },
                { title: "Min closed at", value: `${el?.datas?.appeal}` },
                {
                  title: "Court",
                  value: (
                    <MyBadge color={el?.datas?.courtID}>
                      {ENUMS.courts[el?.datas?.courtID].court}
                    </MyBadge>
                  ),
                },
                {
                  title: "Court",
                  value: el?.datas?.nbArbitrators,
                },
                {
                  title: "Decision",
                  value: el?.datas?.decision ? (
                    [
                      <CVName cvID={el?.datas?.payerID} />,
                      <CVName cvID={el?.datas?.payeeID} />,
                    ]?.[el?.datas?.decision]
                  ) : (
                    <MySub style={"text-xs"}>Waiting</MySub>
                  ),
                },
              ]}
              style={"mr-3 w-full rounded-tl-none "}
            >
              {/* <div className=" mt-3 flex justify-end">
                {isDispute?.datas?.timers?.createdAt == 0 &&
                  (state?.features?.[index]?.datas?.cvWorker == cv ||
                    state?.features?.[index]?.datas?.owner == cv) && (
                    <MyBtnPost
                      setter={() =>
                        handlePost(
                          "initDispute",
                          state?.features?.[index]?.datas?.dispute
                        )
                      }
                    >
                      Init
                    </MyBtnPost>
                  )}

                {isAllowance === 2 && (
                  <>
                    <MyBtnPost
                      setter={() =>
                        handlePost("acceptArbitration", [isDispute?.datas?.id])
                      }
                    >
                      Accept Arbitration
                    </MyBtnPost>
                    <MyBtnPost
                      style={"btn-xs btn-error btn-outline ml-2"}
                      setter={() =>
                        handlePost("refuseArbitration", [isDispute?.datas?.id])
                      }
                    >
                      Refuse
                    </MyBtnPost>
                  </>
                )}
              </div> */}
            </MyCardInfos>
          </MyCardDropdown>
        ))}
      </MyScrolledXDiv>
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
//       url={`/mission/${missionID}`}
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
