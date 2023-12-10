import { MyTable } from "components/myComponents/table/MyTable";
import { MENUS_EDIT, MENUS_ID } from "constants/menus";
import {
  doIndexTools,
  doStateProfileTools,
  doStateTools,
  useToolsDispatch,
  useToolsState,
} from "context/tools";
import { useInView } from "framer-motion";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  stateDispute,
  stateFeature,
  stateLaunchpad,
  stateMission,
} from "utils/ui-tools/state-tools";
import {
  HEAD_table_features,
  HEAD_table_invites,
  _table_features,
  _table_invites,
} from "utils/states/tables/feature";

import {
  HEAD_table_missions,
  _table_missions,
} from "utils/states/tables/mission";
import { v4 } from "uuid";
import {
  HEAD_table_launchpads,
  _table_launchpad,
} from "utils/states/tables/launchpad";
import { MyMenusTabs } from "components/myComponents/menu/MyMenus";
import { MyBtnPost } from "components/btn/MyBtnPost";
import { _apiPost } from "utils/ui-tools/web3-tools";
import { doAuthCV, useAuthState } from "context/auth";
import { MissionFeatures } from "sections/missions/state/MissionFeatures";
import { MissionProfile } from "sections/missions/state/MissionProfile";
import { FeatureDispute } from "sections/works/Features/state/FeatureDispute";
import { MyCard } from "components/myComponents/card/MyCard";
import {
  HEAD_table_arbitrators,
  _table_arbitrators,
} from "utils/states/tables/escrow";
import { ENUMS } from "constants/enums";
import { STATUS } from "constants/status";
import { MyModal } from "components/myComponents/modal/MyModal";
import { ImagePin } from "components/Image/ImagePin";
import { LayoutForm } from "sections/Form/LayoutForm";
import { MyInputFile } from "components/myComponents/form/MyInputsFile";
import {
  createImageCIDOnPinata,
  createURI,
  createURICv,
} from "utils/ui-tools/pinata-tools";
import { ADDRESSES } from "constants/web3";

export const CVOverview = () => {
  let { state, index, status } = useToolsState();
  let [isClicked, setIsClicked] = useState(0);
  let [isLists, setIsLists] = useState(null);

  let { cv } = useAuthState();
  let ref = useRef(null);
  let isInView = useInView(ref);
  let dispatch = useToolsDispatch();
  let handlePost = async (func, id) => {
    await _apiPost(func, [id]);

    doStateProfileTools({ dispatch, cvID: state?.profile?.cvID });
  };
  let [isArbitratorsState, setIsArbitratorsState] = useState(null);

  let fetchDisputes = async () => {
    let disputes = [];
    for (
      let index = 0;
      index < state?.profile?.details?.arbitrators?.length;
      index++
    ) {
      let arbitrator = state?.profile?.details?.arbitrators?.[index];
      for (let index = 0; index < arbitrator?.disputes.length; index++) {
        let dispute = await stateDispute(
          arbitrator?.disputes?.[index].disputeID
        );
        dispute.datas.allowance = arbitrator?.disputes?.[index]?.allowance;
        disputes.push(dispute);
      }
    }
    setIsArbitratorsState(disputes);
  };

  useEffect(() => {
    if (
      !isArbitratorsState &&
      ((!state?.front?.target && state?.indexOverview === 4) ||
        state?.front?.target === "dispute")
    ) {
      fetchDisputes();
    }
  }, [state?.front?.target, state?.indexOverview]);

  const components = {
    launchpad: <div>Launchpad</div>,
    feature: state?.front?.target === "feature" && (
      <MissionFeatures featureID={state?.front?.props?.[0]} />
    ),
    mission: state?.front?.target === "mission" && (
      <MissionProfile missionID={state?.front?.props?.[0]} />
    ),
    dispute: state?.front?.target === "dispute" && (
      <FeatureDispute disputeID={state?.front?.props?.[0]} />
    ),
  };

  console.log("osdpopsoodosposdpo stats", state?.profile);

  let infos = [
    {
      btn: "Missions",
      table: _table_missions(state?.profile?.details),
      head: HEAD_table_missions,
      setState: stateMission,
      url: "#section2",
      // btns: MENUS_EDIT.mission,
    },
    {
      btn: "Jobs",
      table: _table_features(state?.profile?.details?.jobs),
      head: HEAD_table_features,
      setState: stateFeature,
      arr: state?.profile?.datas?.proposals,
      url: "#section2",
      // btns: MENUS_EDIT.feature,
    },
    {
      btn: "Launchpads",
      table: _table_launchpad(state?.profile?.details?.launchpads),
      head: HEAD_table_launchpads,
      arr: state?.profile?.datas?.launchpads,
      setState: stateLaunchpad,
      url: "#section2",
      // btns: MENUS_EDIT.invite,
    },
    {
      btn: "Invites",
      table: _table_invites(state?.profile?.details?.invites),
      head: HEAD_table_invites,
      url: "#section2",
      arr: state?.profile?.details?.invites,
      setState: stateFeature,
      editBtns: [
        {
          title: "Accept job",
          setter: (featureID) => {
            fetchDisputes();
            handlePost("acceptJob", [featureID]);
          },
        },
        {
          title: "Decline job",
          setter: (featureID) => {
            fetchDisputes();
            handlePost("declineJob", [featureID]);
          },
          style: "btn-xs btn-error btn-outline ml-2",
        },
      ],
    },
    {
      btn: "Arbitrators",
      table: _table_arbitrators(isArbitratorsState),
      head: HEAD_table_arbitrators,
      arr: isArbitratorsState,
      url: "#section2",

      setState: stateDispute,
      editBtns: [
        {
          title: "Accept",
          setter: (disputeID) => handlePost("acceptArbitration", [disputeID]),
          style: " c2",
        },
        {
          title: "Refuse",
          setter: (disputeID) => handlePost("refuseArbitration", [disputeID]),
          style: "text-error ml-2",
        },
      ],
    },
  ];

  let fetch = async () => {
    let _state = state;
    let _infos = infos;
    let element = _infos?.[state?.indexOverview];

    if (!element?.arr) {
      return;
    }
    let target = element.btn.toLowerCase();
    if (!_state?.profile?.details?.[target]?.length >= 0) {
      _state.profile.details[`${target}`] = [];
    }

    for (let index = 0; index < element?.arr?.length; index++) {
      const id = element?.arr?.[index];
      let el = await element?.setState(id);
      _state.profile.details[target].push(el);
    }

    doStateTools(dispatch, _state);
  };

  useEffect(() => {
    let target = infos?.[state?.indexOverview]?.btn.toLowerCase();
    console.log("test -----------frazz---", isLists?.[target]);
    console.log("test -----------bool---", isInView);

    if (!isLists?.[target] && state?.profile?.details && isInView) {
      console.log("Fetch CV Overview ...", state);

      fetch();
    }
  }, [state?.indexOverview]);

  useEffect(() => {
    let target = infos?.[state?.indexOverview]?.btn.toLowerCase();

    if (
      (!isLists?.[target] ||
        isLists?.[target]?.table?.length !== isLists?.[target]?.arr?.length) &&
      state?.profile?.details?.[target]?.length >= 0
    ) {
      console.log("test -----------frazz---", isLists?.[target]);

      setIsLists({
        ...isLists,
        [target]: infos?.[state?.indexOverview],
      });
    }
  }, [status, isInView]);
  return (
    <>
      {components?.[state?.front?.target] || (
        <div className="flex flex-col p-2 bgprim w-full ">
          <MyMenusTabs
            template={2}
            style={" ml-auto rounded-none pb-5 "}
            color={1}
            setter={(i) =>
              doStateTools(dispatch, { ...state, indexOverview: i })
            }
            value={state?.indexOverview}
            arr={infos}
            target={"btn"}
          >
            Gallery
          </MyMenusTabs>
          {state?.indexOverview != null || state?.indexOverview != undefined ? (
            <MyCard styles={"h-full  rounded-t-none w-full "}>
              <div
                ref={ref}
                className="w-full h-full rounded-lg shadow backdrop-blur "
              >
                <MyTable
                  list={
                    isLists?.[
                      `${infos?.[state?.indexOverview].btn.toLowerCase()}`
                    ]?.table
                  }
                  head={
                    isLists?.[
                      `${infos?.[state?.indexOverview].btn.toLowerCase()}`
                    ]?.head
                  }
                  btns={infos?.[state?.indexOverview]?.btns}
                  editBtns={infos?.[state?.indexOverview]?.editBtns}
                />
              </div>
            </MyCard>
          ) : (
            <div className="flex">
              <MyModal
                styles={{
                  btn: "btn-ghost  w-fit h-fit overflow-scroll hide-scrollbar",
                }}
                btn={
                  <ImagePin
                    style={"h-[70vh] w-[35vw]"}
                    CID={state?.profile?.metadatas?.attributes?.[0]?.cvImg}
                  />
                }
                modal={
                  <ImagePin
                    style={"h-[90vh] w-[80vw] "}
                    CID={state?.profile?.metadatas?.attributes?.[0]?.cvImg}
                  />
                }
              />
              <div className="flex w-full flex-wrap">
                {state?.profile?.metadatas?.attributes?.[0]?.gallery?.map(
                  (el) => (
                    <MyModal
                      key={v4()}
                      styles={{
                        btn: "btn-ghost  w-fit h-fit ",
                      }}
                      btn={
                        <ImagePin
                          styleImg={"w-fit max-w-[110px] absolute "}
                          style={" w-[110px] relative  "}
                          CID={el}
                        />
                      }
                      modal={<ImagePin style={"h-[90vh] w-[80vw] "} CID={el} />}
                    />
                  )
                )}
                <LayoutForm
                  stateInit={{
                    allowed: true,
                    form: { image: null, target: "galleryImg" },
                  }}
                >
                  <MyInputFile
                    style={"mt-auto ml-auto"}
                    target={"image"}
                    label={"Add image"}
                    setter={async (fileURI) => {
                      let gallery;
                      console.log("fileURI", fileURI);
                      if (
                        state?.profile?.metadatas?.attributes?.[0]?.gallery
                          ?.length >= 0
                      ) {
                        gallery =
                          state?.profile?.metadatas?.attributes?.[0]?.gallery;
                        gallery?.push(fileURI);
                      } else {
                        gallery = [fileURI];
                      }
                      if (fileURI) {
                        let uri = await createURI({
                          id: cv,
                          title: "CV",
                          metadatas: {
                            ...state?.profile?.metadatas,
                            attributes: [
                              {
                                ...state?.profile?.metadatas?.attributes?.[0],
                                gallery: gallery,
                              },
                            ],
                          },
                        });
                        console.log('gallery !!!!!"é"!', gallery);
                        await _apiPost("setTokenURIOf", [
                          parseInt(cv),
                          uri,
                          ADDRESSES["cvsHub"],
                        ]);
                        await doStateProfileTools({ dispatch, cvID: cv });
                      }
                    }}
                  ></MyInputFile>
                </LayoutForm>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};
