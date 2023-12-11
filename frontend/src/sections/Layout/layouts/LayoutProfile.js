"use client";

import React, { useEffect, useRef, useState } from "react";

import { useAuthState } from "context/auth";
import {
  doStateToolsProfile,
  useToolsDispatch,
  useToolsState,
} from "context/tools";

import { Icon } from "@iconify/react";
import { icfy, icsystem } from "icones";

import { _table_features } from "utils/states/tables/feature";
import { _table_invites } from "utils/works/feature";

import { _apiGet, _apiPost } from "utils/ui-tools/web3-tools";

import { MyModal } from "components/myComponents/modal/MyModal";
import { CreatePub } from "sections/Pub/form/create/CreatePub";
import { MyLayoutDashboard } from "components/myComponents/layout/MyLayoutDashboard";
import { menus_id } from "constants/menus";
import { LayoutForm } from "sections/Form/LayoutForm";
import { MySelect, MySelects } from "components/myComponents/form/MySelects";
import { stateFeature } from "utils/ui-tools/state-tools";
import { MyMainBtn } from "components/myComponents/btn/MyMainBtn";
import { MySub } from "components/myComponents/text/MySub";
import { ChatBubble } from "components/ChatBubble";

import { MyLayoutBtn } from "components/myComponents/btn/MyLayoutBtn";

export const LayoutProfile = ({ cvID, url, children, controller }) => {
  const { cv } = useAuthState();

  const { state, status, pointer } = useToolsState();
  let [isLoading, setIsLoading] = useState(null);

  let menus = menus_id("profile", cvID);
  let dispatch = useToolsDispatch();
  let fetch = async () => {
    setIsLoading(true);

    let _state = await doStateToolsProfile({
      dispatch,
      state,
      cvID,
      target: controller,
    });

    setIsLoading(false);
  };
  useEffect(() => {
    fetch();
    console.log("Origin fetch");
  }, [cvID, url]);

  if (!state?.profile?.datas?.features?.length) {
    menus[1].sub[2] = undefined;
  }
  if (!state?.profile?.datas?.missions?.length) {
    menus[1].sub[1] = undefined;
  }
  if (!state?.profile?.datas?.proposals?.length) {
    menus[1].sub[3] = undefined;
  }
  if (!state?.profile?.datas?.launchpads?.length) {
    menus[1].sub[4] = undefined;
  }
  if (!state?.profile?.datas?.arbitrators?.length) {
    menus[1].sub[6] = undefined;
  }
  if (cv != cvID) {
    menus[1].sub[5] = undefined;
  } else if (
    state?.profile?.datas?.invitations?.length > 0 ||
    state?.profile?.datas?.notifications > 0
  ) {
    menus[1].sub[5].title = (
      <>
        Notifications{" "}
        <span className="indicator-item badge  badge-xs badge-primary">
          {parseInt(
            state?.profile?.datas?.invitations?.length +
              state?.profile?.datas?.notifications
          )}
        </span>
      </>
    );
  }

  return (
    cvID && (
      <MyLayoutDashboard
        _menus={menus}
        isLoading={isLoading}
        template={0}
        id={cvID}
        btn={<Button></Button>}
        refresh={() =>
          doStateToolsProfile({ dispatch, cvID, target: controller, state })
        }
        owner={state?.profile?.metadatas}
        price={state?.profile?.datas?.amount}
        allowed={cv == cvID}
        statusObj={{
          current: state?.profile?.metadatas?.visibility ? 0 : 1,
          to: state?.profile?.metadatas?.visibility ? 1 : 0,
        }}
        header={state?.profile?.metadatas?.username}
        target={"profile"}
        url={`/profile/${cvID}${url}`}
        // url={url}
      >
        <div className=" pb-20 w-full">{children}</div>
      </MyLayoutDashboard>
    )
  );
};

let Button = () => {
  let { cv, datas } = useAuthState();

  let { state } = useToolsState();
  let [isOpen, setIsOpen] = useState(null);
  let [isDatas, setIsDatas] = useState({ features: null });
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
  }, [isOpen]);

  return (
    <MyLayoutBtn
      btns={[
        {
          icon: icfy.msg.post,
          title: "Post",
          text: "Share a post about what happening ",
        },
        cv != state?.profile?.cvID
          ? {
              icon: icfy.msg.opened,
              title: "Message",
              url: `profile/${cv}/messages`,
              text:
                "Send a direct message to " +
                state?.profile?.metadatas?.username,
            }
          : undefined,
        cv != state?.profile?.cvID
          ? {
              icon: icfy.person.friend,
              title: "Follow",
              text: true
                ? "Unfollow this account and remove his actuality on your social page"
                : "Add this account on your list of follower to keep regard on his actuality",
            }
          : undefined,
        {
          icon: icsystem.mission,
          title: cv == state?.profile?.cvID ? "Mission" : "Invite worker",
          url: cv == state?.profile?.cvID ? "/create/mission" : undefined,

          text:
            cv == state?.profile?.cvID
              ? "Create a mission to build your idea via our protocoles"
              : `Invite ${state?.profile?.metadatas?.username} for work with you`,
        },
        cv == state?.profile?.cvID
          ? {
              icon: icsystem.launchpad,
              title: "Launchpad",
              url: "/create/launchpad",

              text: "Create a launchpad to funds raising",
            }
          : undefined,
        cv == state?.profile?.cvID
          ? {
              icon: icfy.eye.open,
              title: "Visibility",

              text: "Change visibility to block/unblock invitation on feature",
            }
          : undefined,
      ]}
      modals={[
        <CreatePub />,

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

            <MySelect
              arr={isDatas?.features?.map(
                (el) => `#${parseInt(el?.featureID)} ${el?.metadatas?.title}`
              )}
              styles={"mt-4"}
              target="feature"
            />
            <MyMainBtn
              setter={async (form) =>
                await _apiPost("inviteWorker", [
                  state?.profile?.cvID,
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
      id={"toolsProfile"}
      style={"   bg-neutral-900 w-fit c3 rounded flex flex "}
      btn={
        <button className=" flex  items-center justify-center  btn-circle btn-info">
          <Icon icon={icfy.ux.edit} />
        </button>
      }
    >
      <div className="flex w-[270px] flex-col">
        <MyModal
          id={"post"}
          style={"fixed top-0 left-1/2 w-1/2 -translate-y-full"}
          btn={
            <div className="flex w-full hover:bg-white/5 c4 hover:text-white p-5 justify-between">
              <Icon
                icon={icfy.msg.post}
                className="text-[34px] w-[34px] mr-3"
              />
              <div className="flex flex-col w-[200px]">
                <h6 className="font-semibold mb-2 text-sm">Post</h6>
                <p className="font-light text-xs">
                  Share a post on your profile about what happening
                </p>
              </div>
            </div>
          }
        >
          <CreatePub />
        </MyModal>
        {cv != state?.profile?.cvID ? (
          <>
            <div className="flex hover:bg-white/5 p-5 c4 hover:text-white justify-between">
              <Icon
                icon={icfy.msg.opened}
                className="text-[34px] w-[34px] mr-3"
              />
              <div className="flex flex-col w-[200px]">
                <h6 className="font-semibold mb-2 text-sm">Message</h6>
                <p className="font-light text-xs">
                  Send a direct message to this account
                </p>
              </div>
            </div>
            <div className="flex hover:bg-white/5 p-5 c4 hover:text-white justify-between">
              <Icon
                icon={icfy.person.friend}
                className="text-[34px] w-[34px] mr-3"
              />
              <div className="flex flex-col w-[200px]">
                <h6 className="font-semibold mb-2 text-sm">Follow</h6>
                <p className="font-light text-xs">
                  Add this account on your list of follower to keep regard on
                  his actuality
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(isOpen === 3 ? null : 3)}
              className={`flex  ${
                isOpen === 3 ? "bg3 c1" : "hover:bg-white/5 hover:text-white c4"
              }  p-5 text-left   justify-between`}
            >
              <Icon
                icon={icsystem.feature}
                className="text-[34px] w-[34px] mr-3"
              />
              <div className="flex flex-col w-[200px]">
                <h6 className="font-semibold mb-2 text-sm">Invite</h6>
                <p className="font-light text-xs">
                  Propose to this account to work for one of your feature.
                </p>
              </div>
            </button>
          </>
        ) : (
          <>
            <div className="flex hover:bg-white/5 p-5 c4 hover:text-white justify-between">
              <Icon
                icon={icfy.eye.open}
                className="text-[34px] w-[34px] mr-3"
              />
              <div className="flex flex-col w-[200px]">
                <h6 className="font-semibold mb-2 text-sm">Visibility</h6>
                <p className="font-light text-xs">
                  Change visibility to block/unblock invitation on feature
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </MyLayoutBtn>
  );
};
