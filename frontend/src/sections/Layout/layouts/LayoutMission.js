"use client";

import React, { useEffect, useRef, useState } from "react";

import { useAuthState } from "context/auth";
import {
  doStateProfileTools,
  doStateToolsMission,
  doStateToolsProfile,
  useToolsDispatch,
  useToolsState,
} from "context/tools";

import { Icon } from "@iconify/react";
import { icfy, icfyETHER, icfyMAIL, icfySEND, icsystem } from "icones";

import { _table_features } from "utils/states/tables/feature";
import { _table_invites } from "utils/works/feature";

import { CVProfile } from "sections/Profile/state/CVProfile";
import { _apiGet, _apiPost } from "utils/ui-tools/web3-tools";

import { MyModal } from "components/myComponents/modal/MyModal";
import { CreatePub } from "sections/Pub/form/create/CreatePub";
import { MyLayoutDashboard } from "components/myComponents/layout/MyLayoutDashboard";
import { MENUS, menus_id } from "constants/menus";
import { EditWorker } from "sections/works/Features/form/edit/EditWorker";
import { LayoutForm } from "sections/Form/LayoutForm";
import { MySelects } from "components/myComponents/form/MySelects";
import { stateCV, stateFeature } from "utils/ui-tools/state-tools";
import { MyMainBtn } from "components/myComponents/btn/MyMainBtn";
import { MySub } from "components/myComponents/text/MySub";
import { ChatBubble } from "components/ChatBubble";
import { STATUS } from "constants/status";
import { MyLayoutBtn } from "components/myComponents/btn/MyLayoutBtn";
import { clientPocket } from "utils/ui-tools/pinata-tools";

export const LayoutMission = ({ missionID, url, children, controller }) => {
  const { cv } = useAuthState();

  const { state, status, pointer } = useToolsState();
  const tools = useToolsState();
  console.log("tools laout", tools);

  let [isLoading, setIsLoading] = useState(null);

  let dispatch = useToolsDispatch();
  let fetch = async () => {
    setIsLoading(true);
    let _state = await doStateToolsMission({
      dispatch,
      state,
      missionID,
      target: controller,
    });

    setIsLoading(false);
  };

  useEffect(() => {
    if (isLoading === null || status === "idle" || status === "reload") {
      fetch();
      console.log("Origin fetch");
    }
  }, [missionID, status]);
  //   doStateProfileTools;

  //   if (state?.mission?.datas?.launchpad == 0) {
  //     menus[1].sub[6] = undefined;
  //   }

  let menus = menus_id("mission", missionID);
  if (state?.mission?.datas?.launchpad == 0) {
    menus[1].sub[5] = undefined;
  }
  if (state?.mission?.datas?.features?.length === 0) {
    menus[1].sub[4] = undefined;
    menus[1].sub[3] = undefined;
    menus[1].sub[0] = undefined;
  }
  console.log("state", state);
  return (
    <MyLayoutDashboard
      _menus={menus}
      isLoading={isLoading}
      template={0}
      id={missionID}
      btn={<Button controller={controller}></Button>}
      refresh={() =>
        doStateToolsMission({ dispatch, missionID, target: controller, state })
      }
      owner={state?.owner?.metadatas}
      price={state?.profile?.datas?.amount}
      allowed={cv == state?.owner?.cvID}
      statusObj={{
        current: state?.mission?.datas?.status,
        to: state?.mission?.datas?.status + 1,
      }}
      header={state?.profile?.metadatas?.username}
      target={"mission"}
      url={`/works/mission/${missionID}${url}`}
    >
      <div className="bgprim pb-20 min-h-screen w-full">{children}</div>
    </MyLayoutDashboard>
  );
};

let Button = ({ controller, target, missionID }) => {
  let { cv, datas, metadatas } = useAuthState();
  let dispatch = useToolsDispatch();
  let { state } = useToolsState();

  let follow = state?.mission?.details?.social?.followers?.filter(
    (el) => el?.followerID == metadatas?.id
  );

  let [isDatas, setIsDatas] = useState({ follow: null, features: null });
  useEffect(() => {
    if (!isDatas?.features && datas?.features) {
      (async () => {
        let features = [];

        for (let index = 0; index < datas?.features?.length; index++) {
          const featureID = datas?.features?.[index];
          let feature = await stateFeature(featureID);
          if (feature?.datas?.cvWorker == 0)
            features.push(await stateFeature(featureID));
        }
        setIsDatas({ ...isDatas, features });
      })();
    }
  }, [datas?.features]);

  return (
    <MyLayoutBtn
      btns={[
        {
          icon: icfy.msg.post,
          title: "Post",
          text: "Share a post on mission profile about what happening, feedback,issue, ...",
        },
        {
          icon: icfy.msg.opened,
          title: "Message",
          text: "Send a direct message to owner of mission",
        },
        {
          icon: icfy.person.friend,
          title: follow?.length > 0 ? "Unfollow" : "Follow",
          text:
            follow?.length > 0
              ? "Unfollow this mission and remove his actuality on your social page"
              : "Add this mission on your list of follower to keep regard on his actuality",
          setter: async () => {
            let _datas = {
              followerID: metadatas?.id,
              missionID: state?.mission?.metadatas?.id,
            };
            console.log(follow);
            if (follow?.length >= 1) {
              await clientPocket.records.delete(
                "follows_missions",
                follow?.[0]?.id
              );
            } else {
              await clientPocket.records.create("follows_missions", _datas);
            }

            await doStateToolsMission({
              dispatch,
              state,
              missionID: state?.mission?.missionID,
              target: controller,
            });
          },
        },
        {
          icon: icsystem.feature,
          title: cv == state?.mission?.datas?.owner ? "Create" : "Join",
          url:
            cv == state?.mission?.datas?.owner ? "/create/feature" : undefined,

          text:
            cv == state?.mission?.datas?.owner
              ? "Create a new feature for your mission"
              : "Propose your skills for work to one of his feature",
        },
      ]}
      modals={[
        <CreatePub
          refresh={() =>
            doStateToolsMission({
              dispatch,
              state,
              missionID: state?.mission?.missionID,
              target: "pubs",
            })
          }
          style={"border-r-white/5 bg-white/10"}
          mission={state?.mission}
        />,
        <></>,
        <></>,
        <div className=" flex bg-white/5 border-r-white/5 border-white/0 border flex-col p-5 text-xs">
          <LayoutForm
            stateInit={{
              allowed: true,
              placeholders: { feature: "Invite worker to work on ..." },
              form: { target: "inviteWorker", feature: null },
            }}
          >
            <ChatBubble
              ai={true}
              image={{ no: true }}
              text={"For wich feature would you like to invite :"}
            >
              <MySub>{state?.profile?.metadatas?.username}</MySub>
            </ChatBubble>
            <ChatBubble
              image={{ no: true }}
              _form={(form) =>
                !form?.feature
                  ? { color: 3, text: "Please select one of our feature ..." }
                  : state?.profile?.metadatas?.skills?.includes(
                      isDatas?.features?.[form?.feature]?.datas?.specification
                    )
                  ? {
                      text: "Are you sure ? It's seem havn't experience for this kind of task with our protocoles 🧐",
                      color: 2,
                    }
                  : {
                      text: "Great choice ! He have a lot of experiences for this kind of task 😇",
                      color: 1,
                    }
              }
              ai={true}
            ></ChatBubble>
            <ChatBubble
              image={{ no: true }}
              ai={true}
              _form={(form) =>
                form?.feature
                  ? {
                      text: `
                    ${
                      isDatas?.features?.[form?.feature]?.metadatas?.title
                    } 🤝 ${state?.profile?.metadatas?.username}
                  `,
                      color: 4,
                    }
                  : {
                      no: true,
                    }
              }
              text={`If he sign first he gonna be your worker`}
            >
              <span className="flex items-center">
                <MySub style={"flex mt-3 items-center"}></MySub>
              </span>
            </ChatBubble>

            <MySelects
              styles={"mt-4"}
              selects={[
                {
                  target: "feature",
                  arr: isDatas?.features?.map(
                    (el) =>
                      `#${parseInt(el?.featureID)} ${el?.metadatas?.title}`
                  ),
                },
              ]}
            />
            <MyMainBtn
              setter={async (form) =>
                await _apiPost("inviteWorker", [
                  state?.profile?.missionID,
                  isDatas?.features?.[form?.feature]?.featureID,
                ])
              }
              padding={"px-2 py-1 "}
              style={"mt-8 btn-xs"}
              color={1}
              template={1}
              form={true}
            >
              Invite
            </MyMainBtn>
          </LayoutForm>
        </div>,
      ]}
    ></MyLayoutBtn>
  );
};
