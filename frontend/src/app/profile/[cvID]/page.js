"use client";
import { doAuthCV, useAuthDispatch, useAuthState } from "context/auth";

import { LayoutProfile } from "sections/Profile/LayoutProfile";
import { ImagePin } from "components/Image/ImagePin";
import { MyModal } from "components/myComponents/modal/MyModal";
import { useMissionDispatch } from "context/hub/mission";
import { doStateCV, useCVDispatch, useCVState } from "context/hub/cv";
import { useEffect, useState } from "react";
import { MySideList } from "components/myComponents/MySideList";
import { MyCard, MyCard1 } from "components/myComponents/card/MyCard";
import { _apiGet, _apiPost } from "utils/ui-tools/web3-tools";
import { ADDRESSES } from "constants/web3";
import { Pub } from "components/Pub";
import { v4 } from "uuid";
import { icfy, icfyCV, icfyETHER } from "icones";
import {
  MyCardList,
  MyHeaderCard,
} from "components/myComponents/card/MyHeaderCard";
import { EditProfile } from "sections/Profile/form/edit/EditProfile";
import { styles } from "styles/style";
import { BtnGb2, BtnGr2 } from "components/myComponents/btn/MyGradientButton";
import { Icon } from "@iconify/react";

import { useAccount } from "wagmi";
import { ENUMS } from "constants/enums";
import { Hg, Hg1 } from "components/text/HeroGradient";
import { MyTable } from "components/myComponents/table/MyTable";
import { HEAD_table_missions, _table_missions } from "utils/works/mission";
import { MENUS_EDIT } from "constants/menus";
import { stateDetailsCV } from "utils/ui-tools/state-tools";
import { LaunchpadCard } from "components/Launchpad/LaunchpadCard";

export default function Profile({ params }) {
  let user = useAuthState();
  let { isConnected, address } = useAccount();
  let state = useCVState();

  let [isPubs, setIsPubs] = useState(null);
  let { cv } = useAuthState();
  let { cvID, metadatas, datas } = useCVState();
  console.log("datas", datas);
  console.log("metadatas", metadatas);
  let fetchState = async () => {
    setIsPubs(await _apiGet("indexerOfToken", [cvID, ADDRESSES["pubsHub"]]));
  };

  let [isDetails, setIsDetails] = useState(null);
  let details = async () => {
    setIsDetails(await stateDetailsCV(cvID));
  };
  let [isFollow, setIsFollow] = useState(null);
  let [isFollower, setIsFollower] = useState(null);
  let dispatchCV = useCVDispatch();
  let dispatchAuth = useAuthDispatch();
  let checkFollow = async () => {
    setIsFollow(await _apiGet("isFollow", [cv, cvID]));
    setIsFollower(await _apiGet("isFollow", [cvID, cv]));
  };

  let setFollow = async (followFunc) => {
    if (cv !== cvID) {
      await _apiPost(followFunc, [cvID]);
      doAuthCV(dispatchAuth, address);
      doStateCV(dispatchCV, cvID);
      checkFollow();
    }
  };

  console.log(datas);
  useEffect(() => {
    if (!isPubs || isPubs.length !== datas?.pubs) {
      fetchState();
    }
    if (!isDetails && cvID && cvID > 0) details();
  }, [cvID, datas?.pubs]);
  return (
    <LayoutProfile params={params}>
      <div className="w-full items-start  flex ">
        <MyCard1
          color={0}
          styles={"w-3/4 mr-5"}
          menus={["Publication", "Missions", "Features", "Launchpads"]}
          head={{
            component: (
              <>
                <div className="flex items-center">
                  <span className="text-white  text-xs flex flex-col items-center mr-3">
                    <Icon icon={icfyETHER} className="text-4xl text-white" />{" "}
                    <Hg1>Dépenses </Hg1>
                  </span>
                  <div className="flex flex-col">
                    <span className="text-2xl text-white items-center flex ">
                      {datas?.amount}
                      <Hg1 style="text-lg ml-2">ETH</Hg1>
                    </span>
                    <div
                      className={`badge badge-sm badge-outline py-2 px-4 badge-${
                        metadatas?.attributes?.[0]?.visibility
                          ? "success"
                          : "error"
                      }`}
                    >
                      <Icon
                        icon={
                          metadatas?.attributes?.[0]?.visibility
                            ? icfy.eye.open
                            : icfy.eye.close
                        }
                        className="mr-4  text-sm"
                      />
                      {metadatas?.attributes?.[0]?.visibility
                        ? "Disponible"
                        : "Unvailable"}
                    </div>
                  </div>
                </div>
              </>
            ),
          }}
          components={[
            <div className="w-full flex flex-col border-r-2 max-h-[40vh] h-[35vh]  overflow-y-scroll hide-scrollbar border border-white/10 border-y-0 border-l-0">
              {isPubs?.length > 0 ? (
                isPubs?.map((pubID, index) => (
                  <Pub
                    id={pubID}
                    styles={{ size: "10px", clamp: "4" }}
                    key={v4()}
                    _owner={metadatas}
                  />
                ))
              ) : (
                <p className="text-center text-white/40 my-auto">
                  No pubs found
                </p>
              )}
            </div>,
            <MyTable
              state={state}
              list={_table_missions(state, isDetails)}
              head={HEAD_table_missions}
              editBtns={MENUS_EDIT.mission}
            />,
            <div className=""></div>,
            <div className="flex flex-wrap">
              {datas?.launchpads?.map((id) => (
                <LaunchpadCard id={id} style={"mr-3"} key={v4()} />
              ))}
            </div>,
          ]}
        ></MyCard1>

        <div className="w-1/4">
          <MyCardList
            color={1}
            head={{
              title: "Profile",
              icon: icfyCV,
            }}
            btn={
              cv == cvID && cv ? (
                <EditProfile
                  styles={styles.gbtn + "gb2   normal-case btn-xs"}
                />
              ) : isFollow ? (
                <BtnGr2
                  disabled={!isConnected}
                  style={"btn-xs normal-case"}
                  setter={() => setFollow("unfollowCV")}
                >
                  <p className="mx-5">{"Unfollow"}</p>
                </BtnGr2>
              ) : (
                <BtnGb2
                  disabled={!isConnected}
                  style={"btn-xs normal-case"}
                  setter={() => setFollow("followCV")}
                >
                  <p className="mx-5">{"Follow"}</p>
                </BtnGb2>
              )
            }
            arr={[
              {
                title: "Amount",
                value: (
                  <p className="flex items-center">
                    {datas?.amount} <Icon icon={icfyETHER} className="" />
                  </p>
                ),
              },
              {
                title: "Visibilité",
                value: (
                  <span>
                    {metadatas?.attributes?.[0]?.visibility === true
                      ? "Disponible"
                      : "Indisponible"}
                  </span>
                ),
              },
              { title: "Missions", value: <>{datas?.missions}</> },
              { title: "Tasks", value: <>{datas?.features}</> },
              { title: "Jobs", value: <>{datas?.proposals?.length}</> },

              {
                title: "Launchpads",
                value: datas?.launchpads?.length,
              },
              {
                title: "Disputes",
                value: "O",
              },
              {
                title: "Arbitres",
                value: "O",
              },

              {
                value: (
                  <p className="absolute bottom-0 text-[9px] text-info">
                    CV #{cvID}{" "}
                  </p>
                ),
              },
            ]}
          />
          <MyCard1
            styles={"mt-5"}
            color={1}
            menus={["on Chain", "off Chain"]}
            head={{
              title: "Work",
              icon: icfyCV,
            }}
            btn={
              <BtnGr2 disabled={!isConnected} style={"btn-xs normal-case"}>
                <p className="mx-5">{"Invite worker"}</p>
              </BtnGr2>
            }
            components={[
              <div className=""></div>,
              <div className="w-full flex flex-wrap">
                <div className={`flex flex-col w-1/2 mb-2    rounded-lg`}>
                  <div className="text-xs text-white/40 mb-1">Domain</div>
                  <div className="uppercase flex  items-center">
                    <Icon
                      icon={
                        ENUMS.domain[metadatas?.attributes?.[0]?.domain]?.icon
                      }
                      className={` text-xl mr-2 text-${
                        ENUMS.domain[metadatas?.attributes?.[0]?.domain]?.color
                      }`}
                    />
                    {ENUMS.domain[metadatas?.attributes?.[0]?.domain]?.name}
                  </div>
                </div>
                <div
                  className={`flex flex-col w-1/2 mb-2  text-right  rounded-lg`}
                >
                  <div className="text-xs text-white/40 mb-1">Skills</div>
                  <div className=" flex">
                    {metadatas?.attributes?.[0]?.skills?.map((el) => (
                      <Icon
                        key={v4()}
                        icon={ENUMS.courts[el].badge}
                        className="text-2xl ml-2"
                      />
                    ))}
                  </div>
                </div>
              </div>,
            ]}
          />
        </div>
      </div>
    </LayoutProfile>
  );
}
