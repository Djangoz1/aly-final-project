"use client";
import { doAuthCV, useAuthDispatch, useAuthState } from "context/auth";

import { LayoutProfile } from "sections/Profile/LayoutProfile";
import { ImagePin } from "components/Image/ImagePin";
import { MyModal } from "components/myComponents/modal/MyModal";
import { useMissionDispatch } from "context/hub/mission";
import { doStateCV, useCVDispatch, useCVState } from "context/hub/cv";
import { useEffect, useState } from "react";
import { MySideList } from "components/myComponents/MySideList";
import { MyCard } from "components/myComponents/card/MyCard";
import { _apiGet, _apiPost } from "utils/ui-tools/web3-tools";
import { ADDRESSES } from "constants/web3";
import { Pub } from "components/Pub";
import { v4 } from "uuid";
import { icfy, icfyCV, icfyETHER } from "icones";
import { MyHeaderCard } from "components/myComponents/card/MyHeaderCard";
import { EditProfile } from "sections/Profile/form/edit/EditProfile";
import { styles } from "styles/style";
import { BtnGb2, BtnGr2 } from "components/myComponents/btn/MyGradientButton";
import { Icon } from "@iconify/react";
import { DEV_DOMAIN } from "constants/languages";
import { useAccount } from "wagmi";

export default function Profile({ params }) {
  let user = useAuthState();
  let { isConnected, address } = useAccount();

  let [isPubs, setIsPubs] = useState(null);
  let { cv } = useAuthState();
  let { cvID, metadatas, datas } = useCVState();
  console.log("datas", datas);
  console.log("metadatas", metadatas);
  let state = async () => {
    setIsPubs(await _apiGet("indexerOfToken", [cvID, ADDRESSES["pubsHub"]]));
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

  useEffect(() => {
    if (!isPubs || isPubs.length !== datas?.pubs) {
      state();
    }
  }, [cvID, datas?.pubs]);
  return (
    <LayoutProfile params={params}>
      <div className="w-full items-start  flex ">
        <MyHeaderCard
          icon={icfyCV}
          head={{
            title: "Profile",
          }}
          btn={
            cv == cvID && cv ? (
              <EditProfile styles={styles.gbtn + "gb1   normal-case btn-xs"} />
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
            {
              title: "Domain",
              value: DEV_DOMAIN[metadatas?.attributes?.[0]?.domain]?.name,
            },
          ]}
        />
        <MyCard
          head={{ title: "Pubs", icon: icfy.msg.chat }}
          styles={"w-1/3 ml-5"}
        >
          <div className="w-full flex flex-col border-r-2 max-h-[40vh] h-[25vh]  overflow-y-scroll hide-scrollbar border border-white/10 border-y-0 border-l-0">
            {isPubs?.length > 0 ? (
              isPubs?.map((pubID, index) => (
                <Pub
                  id={pubID}
                  styles={{ size: "10px", clamp: 3 }}
                  key={v4()}
                  _owner={metadatas}
                />
              ))
            ) : (
              <p className="text-center text-white/40 my-auto">No pubs found</p>
            )}
          </div>
        </MyCard>
      </div>
    </LayoutProfile>
  );
}
