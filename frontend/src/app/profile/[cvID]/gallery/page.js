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
import { MySub } from "components/myComponents/text/MySub";
import { MyCardFolder } from "components/myComponents/card/MyCardFolder";
import { MyFramerModal } from "components/myComponents/box/MyFramerModals";
import { MyCard } from "components/myComponents/card/MyCard";
import { LayoutProfile } from "sections/Layout/layouts/LayoutProfile";
import { MENUS } from "constants/menus";
import { LayoutForm } from "sections/Form/LayoutForm";
import { MyInputFile } from "components/myComponents/form/MyInputsFile";

function App({ params }) {
  const { cv } = useAuthState();

  const { state, status, pointer } = useToolsState();
  let [isLoading, setIsLoading] = useState(null);
  let [isState, setIsState] = useState(null);

  const cvID = params.cvID;

  let dispatch = useToolsDispatch();

  return (
    <LayoutProfile controller={"gallery"} cvID={cvID} url={"/gallery"}>
      <>
        <div className="flex h-screen">
          {state?.profile?.metadatas?.cvImg ? (
            <MyModal
              styles={{
                btn: "btn-ghost  w-fit h-fit overflow-scroll hide-scrollbar",
              }}
              btn={
                <ImagePin
                  metadatas={state?.profile?.metadatas}
                  style={"h-[70vh] w-[35vw]"}
                  CID={state?.profile?.metadatas?.cvImg}
                />
              }
            >
              <ImagePin
                metadatas={state?.profile?.metadatas}
                style={"h-[90vh] w-[80vw] "}
                CID={state?.profile?.metadatas?.cvImg}
              />
            </MyModal>
          ) : undefined}
          <div className="flex w-full flex-wrap">
            {state?.profile?.metadatas?.gallery?.map((el) => (
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
              >
                <ImagePin style={"h-[90vh] w-[80vw] "} CID={el} />
              </MyModal>
            ))}
            <LayoutForm
              stateInit={{
                allowed: true,
                form: { image: null, target: "galleryImg" },
              }}
            >
              <MyInputFile
                style={"mt-auto mb-20 ml-auto"}
                target={"image"}
                label={"Add image"}
                setter={async (fileURI) => {
                  let gallery;
                  console.log("fileURI", fileURI);
                  if (state?.profile?.metadatas?.gallery?.length >= 0) {
                    gallery = state?.profile?.metadatas?.gallery;
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
      </>
    </LayoutProfile>
  );
}

export default App;
