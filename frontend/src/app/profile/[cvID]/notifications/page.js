"use client";

import React, { useEffect, useRef, useState } from "react";

import { useAuthState } from "context/auth";
import { useToolsDispatch, useToolsState } from "context/tools";

import { Icon } from "@iconify/react";
import { icfy, icfyETHER, icfyMAIL, icfySEND, icsystem } from "icones";

import {
  HEAD_table_features,
  _table_features,
} from "utils/states/tables/feature";
import { _table_invites } from "utils/works/feature";

import { _apiGet, _apiPost } from "utils/ui-tools/web3-tools";

import { ENUMS } from "constants/enums";

import { v4 } from "uuid";

import { MySub } from "components/myComponents/text/MySub";

import { MyCard } from "components/myComponents/card/MyCard";
import { LayoutProfile } from "sections/Layout/layouts/LayoutProfile";

import { MyTitle } from "components/myComponents/text/MyTitle";
import { MyNum } from "components/myComponents/text/MyNum";
import { MyMainBtn } from "components/myComponents/btn/MyMainBtn";
import { ProfileAvatar } from "components/profile/ProfileAvatar";
import { MySelect } from "components/myComponents/form/MySelects";
import { LayoutForm } from "sections/Form/LayoutForm";
import { MyBadge } from "components/myComponents/box/MyList";
import { MissionName } from "components/links/MissionName";
import { NoItems } from "components/myComponents/layout/NoItems";

function App({ params }) {
  const { cv } = useAuthState();

  const { state, status, pointer } = useToolsState();
  let ref = useRef(null);
  const cvID = params.cvID;

  let [isLength, setIsLength] = useState(null);
  //   let isTable = {
  //     btn: "Missions",
  //     table:,
  //     head: ,
  //     setState: stateMission,

  //     // btns: MENUS_EDIT.mission,
  //   };
  useEffect(() => {
    let demands = 0;
    let invites = state?.notifications?.invitations?.length;
    state?.notifications?.demands?.map(
      (el) => (demands += el?.details.demands?.length)
    );

    setIsLength({ demands, invites });
  }, [state?.notifications]);
  console.log(state);

  return (
    <LayoutProfile
      controller={"notifications"}
      cvID={cvID}
      target={"profile"}
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
        <div className="flex mt-5 w-full">
          <MyCard template={1} styles={"h-full w-1/2 rounded-t-none w-full "}>
            <div className="p-2  border border-white/0 border-b-white/5 flex items-center w-full">
              <span className="bg-white/10 rounded-lg p-2 mr-2">
                <Icon icon={icfy.ux.admin} />
              </span>
              <div className="flex flex-col">
                <MyTitle>Notifications</MyTitle>
                <MySub style={"text-xs flex items-center gap-2 c4 "}>
                  <MyNum num={isLength?.demands} />
                  demands inbox
                </MySub>
              </div>
              {state?.notifications?.demands?.length > 1 ? (
                <MySelect
                  styles={"ml-auto mr-3"}
                  target={"demands"}
                  arr={[
                    "All",
                    ...state?.notifications?.demands?.map((el) => (
                      <>
                        <Icon
                          icon={ENUMS.courts[el?.datas?.specification]?.badge}
                        />
                        {el?.metadatas?.title}
                      </>
                    )),
                  ]}
                />
              ) : (
                <></>
              )}
            </div>
            <div className="w-full h-full rounded-lg  shadow backdrop-blur ">
              {state?.notifications?.demands?.length > 0 ? (
                state?.notifications?.demands?.map((feature) => (
                  <div
                    className="flex flex-col border border-white/0 border-t-white/5  pt-5 gap-2"
                    key={v4()}
                  >
                    <div className="flex items-center">
                      <Icon className="mr-2 rotate-90" icon={icfy.ux.arrow} />
                      <MySub>{feature?.metadatas?.title}</MySub>
                    </div>
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

                        <ProfileAvatar
                          cvID={parseInt(account?.cvID)}
                          style={"w-10 h-10 m-2"}
                          metadatas={account?.metadatas}
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
                                account?.cvID,
                              ])
                            }
                            style={"btn  btn-success  btn-xs"}
                            icon={icfy.ux.check.casual}
                            template={3}
                          ></MyMainBtn>
                        </div>
                      </div>
                    ))}
                  </div>
                ))
              ) : (
                <NoItems icon={icsystem.mission} />
              )}
            </div>
          </MyCard>

          <MyCard template={1} styles={"h-full w-1/2 rounded-t-none w-full "}>
            <div className="p-2  border border-white/0 border-b-white/5 flex items-center w-full">
              <span className="bg-white/10 rounded-lg p-2 mr-2">
                <Icon icon={icfy.ux.admin} />
              </span>
              <div className="flex flex-col">
                <MyTitle>Invitations</MyTitle>
                <MySub style={"text-xs flex items-center gap-2 c4 "}>
                  <MyNum num={isLength?.invites} />
                  invitations inbox
                </MySub>
              </div>
              {state?.notifications?.invitations?.length > 1 ? (
                <MySelect
                  styles={"ml-auto mr-3"}
                  target={"demands"}
                  arr={[
                    "All",
                    ...state?.notifications?.invitations?.map(
                      (el) => el?.metadatas?.title
                    ),
                  ]}
                />
              ) : (
                <></>
              )}
            </div>
            <div className="w-full h-full rounded-lg  shadow backdrop-blur ">
              {state?.notifications?.invitations?.length > 0 ? (
                state?.notifications?.invitations?.map((feature, i) => (
                  <div
                    className="flex  flex-col border border-white/0 border-t-white/5  pt-5 gap-2"
                    key={v4()}
                  >
                    <div className="flex items-center">
                      <Icon className="mr-2 rotate-90" icon={icfy.ux.arrow} />
                      <MySub>{feature?.metadatas?.title}</MySub>
                    </div>
                    <div className="flex items-center gap-3">
                      <MyBadge color={1}>
                        <MissionName
                          id={feature?.datas?.missionID}
                          metadatas={feature?.metadatas?.["@expand"]?.missionID}
                        />
                      </MyBadge>
                      <MyBadge color={i}>
                        <Icon
                          icon={
                            ENUMS.courts[feature?.datas?.specification]?.badge
                          }
                        />
                        {ENUMS.courts[feature?.datas?.specification]?.court}
                      </MyBadge>
                    </div>
                    <MyCard
                      styles={
                        "w-full px-2 py-1 flex items-center justify-between"
                      }
                      template={3}
                      key={v4()}
                    >
                      <ProfileAvatar
                        cvID={feature?.owner?.cvID}
                        metadatas={feature?.owner?.metadatas}
                      />{" "}
                      <div className="flex">
                        {console.log(feature.featureID)}
                        <MyMainBtn
                          style={"btn btn-ghost text-error btn-xs"}
                          icon={icfy.ux.check.uncheck}
                          _refresh={false}
                          template={3}
                          setter={async () =>
                            await _apiPost("declineJob", [feature?.featureID])
                          }
                        ></MyMainBtn>
                        <MyMainBtn
                          _refresh={false}
                          setter={async () =>
                            await _apiPost("acceptJob", [feature?.featureID])
                          }
                          style={"btn btn-ghost  btn-xs"}
                          icon={icfy.ux.check.casual}
                          template={1}
                        ></MyMainBtn>
                      </div>
                    </MyCard>
                  </div>
                ))
              ) : (
                <NoItems target={"Invitations"} icon={icsystem.feature} />
              )}
            </div>
          </MyCard>
        </div>

        {/* <MissionProfile missionID={state?.front?.props?.[0]} /> */}
      </LayoutForm>
    </LayoutProfile>
  );
}

export default App;
