"use client";

import React, { useEffect, useRef, useState } from "react";

import { useAuthState } from "context/auth";
import {
  doStateProfileTools,
  useToolsDispatch,
  useToolsState,
} from "context/tools";

import { _table_features } from "utils/states/tables/feature";
import { _table_invites } from "utils/works/feature";

import { _apiGet } from "utils/ui-tools/web3-tools";
import { ADDRESSES } from "constants/web3";
import { MyModal } from "components/myComponents/modal/MyModal";
import { ImagePin } from "components/Image/ImagePin";
import { v4 } from "uuid";

import { LayoutProfile } from "sections/Layout/layouts/LayoutProfile";
import { MENUS } from "constants/menus";
import { LayoutForm } from "sections/Form/LayoutForm";
import { MyInputFile } from "components/myComponents/form/MyInputsFile";
import { LayoutMission } from "sections/Layout/layouts/LayoutMission";

function App({ params }) {
  const { cv } = useAuthState();

  const { state, status, pointer } = useToolsState();
  let [isLoading, setIsLoading] = useState(null);
  let [isState, setIsState] = useState(null);

  const missionID = params.missionID;

  let dispatch = useToolsDispatch();

  return (
    <LayoutMission
      controller={"gallery"}
      missionID={missionID}
      url={"/gallery"}
    >
      <>
        <div className="flex h-screen">
          <div className="flex w-full flex-wrap">
            {state?.gallery?.map((el) => (
              <MyModal
                id={el?.id}
                key={v4()}
                styles={{
                  btn: "btn-ghost  w-fit h-fit ",
                }}
                btn={
                  <ImagePin
                    metadatas={el}
                    styleImg={"w-fit max-w-[110px] absolute "}
                    style={" w-[110px] relative  "}
                    CID={el?.image}
                  />
                }
              >
                <ImagePin
                  metadatas={el}
                  style={"h-[90vh] w-[80vw] "}
                  CID={el?.image}
                />
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

                    await _apiPost("setTokenURIOf", [
                      parseInt(cv),
                      uri,
                      ADDRESSES["cvsHub"],
                    ]);
                    await doStateProfileTools({ dispatch, missionID: cv });
                  }
                }}
              ></MyInputFile>
            </LayoutForm>
          </div>
        </div>
      </>
    </LayoutMission>
  );
}

export default App;
