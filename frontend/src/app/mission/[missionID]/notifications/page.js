"use client";

import React, { useEffect, useRef, useState } from "react";

import { useAuthState } from "context/auth";
import { useToolsDispatch, useToolsState } from "context/tools";

import { Icon } from "@iconify/react";
import { icfy, icfyETHER, icfyMAIL, icfySEND, icsystem } from "icones";

import { _apiGet, _apiPost } from "utils/ui-tools/web3-tools";

import { ENUMS } from "constants/enums";

import { v4 } from "uuid";

import { MySub } from "components/myComponents/text/MySub";

import { MyCard } from "components/myComponents/card/MyCard";
import { LayoutProfile } from "sections/Layout/layouts/LayoutProfile";

import { MyTitle } from "components/myComponents/text/MyTitle";
import { MyNum } from "components/myComponents/text/MyNum";
import { MyMainBtn } from "components/myComponents/btn/MyMainBtn";
import { Avatar, ProfileAvatar } from "components/profile/ProfileAvatar";

import { LayoutForm } from "sections/Form/LayoutForm";
import { MyBadge } from "components/myComponents/box/MyList";

import { MyCardDropdown } from "components/myComponents/card/MyCardDropdown";
import { FeatureName } from "components/links/FeatureName";
import { CVName } from "components/links/CVName";
import { LayoutMission } from "sections/Layout/layouts/LayoutMission";
import { NoItems } from "components/myComponents/layout/NoItems";

function App({ params }) {
  const { cv } = useAuthState();

  const { state, status, pointer } = useToolsState();
  const missionID = params.missionID;


  return (
    <LayoutMission
      missionID={missionID}
      controller={"features"}
      url={"/notifications"}
    >
      <LayoutForm
        stateInit={{
          allowed: true,
          placeholders: { demands: "Filter" },
          form: {
            target: "selectedFeature",
            invitations: "All",
            demands: "All",
          },
        }}
      >
        <div className="flex w-full">
          <MyCard template={1} styles={"h-full rounded-t-none w-full "}>
            <div className="p-2  border border-white/0 border-b-white/5 flex items-center w-full">
              <span className="bg-white/10 rounded-lg p-2 mr-2">
                <Icon icon={icfy.ux.admin} />
              </span>
              <div className="flex flex-col">
                <MyTitle>Notifications</MyTitle>
                <MySub style={"text-xs flex items-center gap-2 c4 "}>
                  <MyNum
                    num={
                        ...state?.features
                          ?.filter((el) => el?.details?.workerDemand?.length)
                          ?.map(el => el?.details?.workerDemand)
                          ?.length
                     
                    }
                  />
                  demands inbox
                </MySub>
              </div>
            </div>
            <div className="w-full h-full rounded-lg  shadow backdrop-blur ">
              {state?.features
                ?.filter((feature) => feature?.details?.workerDemand?.length)?.length ?  state?.features
                ?.filter((feature) => feature?.details?.workerDemand?.length)
                ?.map((feature) => (
                  <MyCardDropdown
                    header={
                            <>
                                <Icon icon={ENUMS.courts[feature?.datas?.specification]?.badge} className="text-lg mr-2 "/>
                        <MyNum num={feature?.details?.demands?.length}>
                          <MySub size={7}>Demands</MySub>
                        </MyNum>{" "}
                      </>
                    }
                    className="flex flex-col border border-white/0 border-t-white/5  pt-5 gap-2"
                    key={v4()}
                    title={
                      <FeatureName
                        style={"uppercase font-medium text-white/70"}
                        metadatas={feature?.metadatas}
                        missionID={feature?.datas?.missionID}
                      ></FeatureName>
                    }
                  >
                    {feature?.details?.demands?.map((account, i) => (
                      <div
                        className={
                          "w-full on_hover pr-2 py-1  h-fit flex items-center border border-y-white/10 border-x-white/0  hover:bg-white/5"
                        }
                        template={3}
                        key={v4()}
                      >
                        <div
                          className={`pl-1  mr-2 py-3 g1 ${
                            ["gb1", "gr1"]?.[i % 2]
                          }`}
                        />

                        <Avatar
                          designation={true}
                          style={"w-10 h-10 mr-10 "}
                          metadatas={account?.metadatas}
                        />
                        <CVName
                          metadata={account?.metadatas}
                          missionID={account?.missionID}
                        />
                        <MyBadge style={"ml-2"}>
                          <Icon
                            icon={
                              ENUMS.domain[account?.metadatas?.domain]?.icon
                            }
                          />
                          {ENUMS.domain[account?.metadatas?.domain]?.name}
                        </MyBadge>
                        <div className="flex ml-auto on_hover_view">
                          <MyMainBtn
                            setter={async () =>
                              await _apiPost("signWorker", [
                                feature?.featureID,
                                account?.missionID,
                              ])
                            }
                            style={"btn  btn-success  btn-xs"}
                            icon={icfy.ux.check.casual}
                            template={3}
                          >
                            Sign
                          </MyMainBtn>
                        </div>
                      </div>
                    ))}
                  </MyCardDropdown>
                ))
              : <NoItems target={'Notifications'}/>}
            </div>
          </MyCard>
        </div>

        {/* <MissionProfile missionID={state?.front?.props?.[0]} /> */}
      </LayoutForm>
    </LayoutMission>
  );
}

export default App;
