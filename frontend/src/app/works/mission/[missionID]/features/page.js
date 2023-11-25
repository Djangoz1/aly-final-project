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

import { MyCard } from "components/myComponents/card/MyCard";
import { LayoutMission } from "sections/Layout/layouts/LayoutMission";

import { MyScrolledXDiv } from "components/myComponents/box/MyScrolledXDiv";
import { CVName } from "components/inputs/inputsCV/CVName";
import { MyNum } from "components/myComponents/text/MyNum";
import { MyCountdown, MyCounter } from "components/myComponents/MyCountdown";
import { MyStatus } from "components/myComponents/item/MyStatus";
import { MyMainBtn } from "components/myComponents/btn/MyMainBtn";
import { STATUS } from "constants/status";
import { MyCardIc } from "components/myComponents/card/MyCardIc";
import { MyBadge, MyList } from "components/myComponents/box/MyList";
import { MyModal } from "components/myComponents/modal/MyModal";

function App({ params }) {
  const { cv } = useAuthState();

  const { state, status, pointer } = useToolsState();

  let [selectedID, setSelectedID] = useState(null);
  const missionID = params.missionID;
  console.log(state);
  let dispatch = useToolsDispatch();

  return (
    <LayoutMission
      controller={"features"}
      missionID={missionID}
      url={"/features"}
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

      <MyList
        title={"List features"}
        description={"All features of " + state?.mission?.metadatas?.title}
        withoutBtn={true}
        head={["Created", "Title", "Court", "Status", "Worker", "Wadge", ""]}
        arr={state?.features?.map((el) => [
          el?.metadatas?.created,
          el?.metadatas?.title,
          ENUMS.courts[el?.datas?.specification]?.court,
          <MyStatus
            padding={"px-3 py-1 text-xs"}
            status={el?.datas?.status}
            target={"feature"}
          />,
          <CVName cvID={el?.datas?.cvWorker} />,
          <MyBadge>{el?.datas?.wadge} ETH</MyBadge>,
          <MyModal
            btn={
              <MyMainBtn
                icon={false}
                style={"whitespace-nowrap btn-xs ml-auto"}
                template={1}
              >
                View more
              </MyMainBtn>
            }
          >
            <div className="">
              {el?.metadatas?.abstract ? (
                <span className="text-xs c4 font-light mb-1">
                  {el?.metadatas?.abstract}
                </span>
              ) : (
                <></>
              )}
              <article className="whitespace-break-spaces text-xs c3 font-light">
                {el?.metadatas?.description}
              </article>
            </div>
          </MyModal>,
        ])}
      />
    </LayoutMission>
  );
}

export default App;
