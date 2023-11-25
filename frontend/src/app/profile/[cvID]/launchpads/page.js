"use client";

import React, { useEffect, useRef, useState } from "react";

import { useAuthState } from "context/auth";
import {
  doStateProfileTools,
  doStateToolsProfile,
  useToolsDispatch,
  useToolsState,
} from "context/tools";

import {
  stateCV,
  stateDetailsCV,
  stateFeature,
  stateMission,
  statePub,
} from "utils/ui-tools/state-tools";

import { Icon } from "@iconify/react";
import { icfy, icfyETHER, icfyMAIL, icfySEND, icsystem } from "icones";

import { MyLayoutApp } from "components/myComponents/layout/MyLayoutApp";
import {
  HEAD_table_features,
  _table_features,
} from "utils/states/tables/feature";
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
import { MySub } from "components/myComponents/text/MySub";
import { MyCardFolder } from "components/myComponents/card/MyCardFolder";
import { MyFramerModal } from "components/myComponents/box/MyFramerModals";
import { MyCard } from "components/myComponents/card/MyCard";
import { LayoutProfile } from "sections/Layout/layouts/LayoutProfile";
import { MENUS } from "constants/menus";
import { MissionProfile } from "sections/works/Missions/state/MissionProfile";
import { MyTable } from "components/myComponents/table/MyTable";
import {
  HEAD_table_missions,
  _table_missions,
} from "utils/states/tables/mission";
import { MyScrolledXDiv } from "components/myComponents/box/MyScrolledXDiv";
import { MyTitle } from "components/myComponents/text/MyTitle";
import { MyNum } from "components/myComponents/text/MyNum";
import { MyStatus } from "components/myComponents/item/MyStatus";
import { MyMainBtn } from "components/myComponents/btn/MyMainBtn";
import { MissionFeatures } from "sections/works/Missions/state/MissionFeatures";
import { CVName } from "components/inputs/inputsCV/CVName";

function App({ params }) {
  const { cv } = useAuthState();

  const { state, status, pointer } = useToolsState();
  let ref = useRef(null);
  const cvID = params.cvID;

  let [isAmount, setIsAmount] = useState(null);

  useEffect(() => {
    if (state?.launchpads && !isAmount) {
      let amount = 0;
      for (let index = 0; index < state?.launchpads.length; index++) {
        const element = state?.launchpads[index];

        amount += parseFloat(element?.datas?.wadge);
      }

      setIsAmount(amount);
    }
  }, [state?.launchpads]);

  //   let isTable = {
  //     btn: "Missions",
  //     table:,
  //     head: ,
  //     setState: stateMission,

  //     // btns: MENUS_EDIT.mission,
  //   };
  console.log(state);
  let dispatch = useToolsDispatch();
  let [selectedID, setSelectedID] = useState(null);
  let colors = [
    "primary",
    "secondary",
    "info",
    "success",
    "error",
    "accent",
    "warning",
  ];
  return (
    <LayoutProfile
      controller={"launchpads"}
      cvID={cvID}
      target={"profile"}
      url={"/launchpads"}
    >
      <div className="flex w-full flex-col-reverse">
        <MyCard template={1} styles={"h-full  rounded-t-none w-full "}>
          <div
            ref={ref}
            className="w-full h-full rounded-lg py-20 shadow backdrop-blur "
          >
            <MyTable
              list={_table_features(state?.jobs)}
              head={HEAD_table_features}

              // btns={infos?.[state?.indexOverview]?.btns}
              // editBtns={infos?.[state?.indexOverview]?.editBtns}
            />
          </div>
        </MyCard>
        <div className="flex w-full">
          <MyScrolledXDiv>
            <>
              <MyFramerModal
                style={
                  "on_hover my-3 min-w-[430px] flex flex-col h-[150px] p-2 mr-2 bg-white/5  "
                }
                arr={state?.jobs?.map((el) => (
                  <>
                    <h6 className="font-light text-sm ">
                      {el?.metadatas?.title}
                    </h6>
                    <div className="flex mb-3 items-center">
                      <Icon icon={icsystem.feature} className="text-lg mr-2" />
                      <MySub>
                        <CVName cvID={el?.datas?.cvWorker} />
                      </MySub>
                      <Icon
                        icon={icfy.bank.dollars}
                        className="text-lg ml-4 mr-2"
                      />
                      <MyNum num={el?.datas?.wadge} />
                      <Icon
                        icon={icfy.person.team}
                        className="text-lg ml-4 mr-2"
                      />
                      <MyNum num={el?.datas?.workers} />
                    </div>
                    <div className="grid mt-3 grid-cols-5 gap-2 items-center">
                      <div
                        className={
                          "badge badge-" + colors[el?.metadatas?.domain]
                        }
                      >
                        {ENUMS.domain[el?.metadatas?.domain]?.name}
                      </div>
                      <div className="badge super-btn">
                        {ENUMS.courts[el?.datas?.specification]?.court}
                      </div>
                      {JSON.parse(el?.metadatas?.skills)?.map((skill, i) => (
                        <div
                          key={v4()}
                          className={"badge badge-" + colors?.[i]}
                        >
                          {skill}
                        </div>
                      ))}
                    </div>

                    <div className="flex mt-auto w-full items-center">
                      {el?.datas?.launchpad > 0 ? (
                        <MyMainBtn
                          template={2}
                          style={"text-xs"}
                          icon={icsystem.launchpad}
                        >
                          Launchpad
                        </MyMainBtn>
                      ) : (
                        <></>
                      )}
                      <MyStatus
                        status={el?.datas?.status}
                        style={" w-full text-xs"}
                        target={"feature"}
                      />
                    </div>
                  </>
                ))}
                selectedId={selectedID}
                setSelectedId={setSelectedID}
              >
                <div className="w-full h-full ">
                  <MissionFeatures
                    featureID={state?.jobs?.[selectedID]?.featureID}
                  />
                </div>
              </MyFramerModal>
            </>
          </MyScrolledXDiv>
          <div className="bg-zinc-900 flex items-center p-4 ">
            <Icon icon={icfyETHER} className="text-[64px]" />
            <div className="flex flex-col">
              <MyNum style={"text-xl"} num={isAmount} />
              <MySub size={8}>Total received</MySub>
            </div>
          </div>
        </div>
      </div>

      {/* <MissionProfile missionID={state?.front?.props?.[0]} /> */}
    </LayoutProfile>
  );
}

export default App;

// export const CVOverview = () => {
//   let { state, index, status } = useToolsState();
//   let [isClicked, setIsClicked] = useState(0);

//   let { cv } = useAuthState();
//   let ref = useRef(null);
//   let isInView = useInView(ref);
//   let dispatch = useToolsDispatch();
//   let handlePost = async (func, id) => {
//     await _apiPost(func, [id]);

//     doStateProfileTools({ dispatch, cvID: state?.profile?.cvID });
//   };
//   let [isArbitratorsState, setIsArbitratorsState] = useState(null);

//   let fetchDisputes = async () => {
//     let disputes = [];
//     for (
//       let index = 0;
//       index < state?.profile?.details?.arbitrators?.length;
//       index++
//     ) {
//       let arbitrator = state?.profile?.details?.arbitrators?.[index];
//       for (let index = 0; index < arbitrator?.disputes.length; index++) {
//         let dispute = await stateDispute(
//           arbitrator?.disputes?.[index].disputeID
//         );
//         dispute.datas.allowance = arbitrator?.disputes?.[index]?.allowance;
//         disputes.push(dispute);
//       }
//     }
//     setIsArbitratorsState(disputes);
//   };

//   useEffect(() => {
//     if (
//       !isArbitratorsState &&
//       ((!state?.front?.target && state?.indexOverview === 4) ||
//         state?.front?.target === "dispute")
//     ) {
//       fetchDisputes();
//     }
//   }, [state?.front?.target, state?.indexOverview]);

//   const components = {
//     launchpad: <div>Launchpad</div>,
//     feature: state?.front?.target === "feature" && (
//       <MissionFeatures featureID={state?.front?.props?.[0]} />
//     ),
//     mission: state?.front?.target === "mission" && (
//       <MissionProfile missionID={state?.front?.props?.[0]} />
//     ),
//     dispute: state?.front?.target === "dispute" && (
//       <FeatureDispute disputeID={state?.front?.props?.[0]} />
//     ),
//   };

//   console.log("osdpopsoodosposdpo stats", state?.profile);

//   let infos = [
//     {
//       btn: "Missions",
//       table: _table_missions(state?.profile?.details),
//       head: HEAD_table_missions,
//       setState: stateMission,
//       url: "#section2",
//       // btns: MENUS_EDIT.mission,
//     },
//   ];

//   let fetch = async () => {
//     let _state = state;
//     let _infos = infos;
//     let element = _infos?.[state?.indexOverview];

//     if (!element?.arr) {
//       return;
//     }
//     let target = element.btn.toLowerCase();
//     if (!_state?.profile?.details?.[target]?.length >= 0) {
//       _state.profile.details[`${target}`] = [];
//     }

//     for (let index = 0; index < element?.arr?.length; index++) {
//       const id = element?.arr?.[index];
//       let el = await element?.setState(id);
//       _state.profile.details[target].push(el);
//     }

//     doStateTools(dispatch, _state);
//   };

//   useEffect(() => {
//     let target = infos?.[state?.indexOverview]?.btn.toLowerCase();

//     if (!isLists?.[target] && state?.profile?.details && isInView) {
//       console.log("Fetch CV Overview ...", state);

//       fetch();
//     }
//   }, [state?.indexOverview]);

//   useEffect(() => {
//     let target = infos?.[state?.indexOverview]?.btn.toLowerCase();

//     if (
//       (!isLists?.[target] ||
//         isLists?.[target]?.table?.length !== isLists?.[target]?.arr?.length) &&
//       state?.profile?.details?.[target]?.length >= 0
//     ) {
//       setIsLists({
//         ...isLists,
//         [target]: infos?.[state?.indexOverview],
//       });
//     }
//   }, [status, isInView]);
//   return (
//     <>
//       {/* //! Faire un ScrolledDivX */}

//       <div className="flex flex-col p-2 bgprim w-full ">
//         <MyMenusTabs
//           template={2}
//           style={" ml-auto rounded-none pb-5 "}
//           color={1}
//           setter={(i) => doStateTools(dispatch, { ...state, indexOverview: i })}
//           value={state?.indexOverview}
//           arr={infos}
//           target={"btn"}
//         ></MyMenusTabs>

//         <MyCard styles={"h-full  rounded-t-none w-full "}>
//           <div
//             ref={ref}
//             className="w-full h-full rounded-lg shadow backdrop-blur "
//           >
//             <MyTable
//               list={
//                 isLists
//                   ?.table
//               }
//               head={
//                 isLists
//                   ?.head
//               }
//               btns={infos?.[state?.indexOverview]?.btns}
//               editBtns={infos?.[state?.indexOverview]?.editBtns}
//             />
//           </div>
//         </MyCard>
//       </div>
//     </>
//   );
// };

// // "use client";

// // function App({ params }) {
// //   const { cv } = useAuthState();

// //   const { state, status, pointer } = useToolsState();
// //   let [isLoading, setIsLoading] = useState(null);
// //   let [isState, setIsState] = useState(null);

// //   const cvID = params.cvID;

// //   let dispatch = useToolsDispatch();
// //   let fetch = async () => {
// //     setIsLoading(true);
// //     let _state = await doStateProfileTools({ dispatch, cvID });
// //     console.log("_state", _state);
// //     setIsState(_state);
// //     setIsLoading(false);
// //   };
// //   useEffect(() => {
// //     if (status === "idle" || status === "reload") {
// //       fetch();
// //       console.log("Origin fetch is datas cv", isState);
// //     }
// //   }, [cvID, status]);

// //   return (
// //     <MyLayoutDashboard
// //       //! isLoading={isLoading}
// //       template={0}
// //       id={cvID}
// //       btn={{
// //         title: "Invite worker",
// //         info: <>Lorem ipsum dolor, sit amet consectetur adipisicing elit.</>,
// //       }}
// //       refresh={() => doStateProfileTools({ dispatch, cvID })}
// //       owner={state?.profile?.metadatas}
// //       price={state?.profile?.datas?.amount}
// //       allowed={cv == cvID}
// //       statusObj={{
// //         current: state?.profile?.metadatas?.visibility ? 0 : 1,
// //         to: state?.profile?.metadatas?.visibility ? 1 : 0,
// //       }}
// //       header={state?.profile?.metadatas?.username}

// //     >
// //       <>
// //         {
// //           [
// //             <></>,
// //             <CVProfile />,
// //             <div className="flex h-full w-full">
// //               <CVMenusDropdown style={"   backdrop-blur mr-[1px] w-1/5"} />

// //             </div>,
// //             cv == cvID ? <EditProfile /> : undefined,
// //           ]?.[pointer]
// //         }

// //         {/*

// //           {cv == cvID && (
// //             <Viewport id={"edit"} index={3}>
// //             </Viewport>
// //           )}
// //           <div className="fixed z-100 bottom-20  flex flex-col items-end right-10">

// //             {state?.profile?.cvID != cv &&
// //               state?.profile?.metadatas?.visibility && (
// //                 <EditWorker styles={"c2"} />
// //               )}
// //           </div> */}
// //       </>
// //     </MyLayoutDashboard>
// //   );
// // }

// // export default App;
