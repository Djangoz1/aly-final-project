import React, { useEffect, useRef, useState } from "react";
import "./style.css";
import { Avatar } from "components/profile/ProfileAvatar";
import {
  doStateProfileTools,
  useToolsDispatch,
  useToolsState,
} from "context/tools";
import { Icon } from "@iconify/react";
import { icfy, icfyGITHUB2, icfyLINKEDIN, icfyTWITTER } from "icones";
import { useAccount } from "wagmi";
import { _apiGet, _apiPost } from "utils/ui-tools/web3-tools";
import { useAuthState } from "context/auth";
import { useInView } from "framer-motion";
import { stateDetailsCV } from "utils/ui-tools/state-tools";
import { MyMainBtn } from "components/myComponents/btn/MyMainBtn";
export const BtnsSocial = () => {
  let { state, pointer } = useToolsState();
  let [isFollow, setIsFollow] = useState(null);
  let [isFollower, setIsFollower] = useState(null);
  let { isConnected } = useAccount();
  let { cv } = useAuthState();

  let checkFollow = async () => {
    setIsFollow(await _apiGet("isFollow", [cv, state?.owner?.cvID]));
    setIsFollower(await _apiGet("isFollow", [state?.owner?.cvID, cv]));
  };

  useEffect(() => {
    if (
      cv > 0 &&
      parseInt(state?.owner?.cvID) > 0 &&
      cv != parseInt(state?.owner?.cvID)
    )
      checkFollow();
  }, [state?.owner?.cvID, cv]);

  console.log(isFollow, isFollower);

  let dispatch = useToolsDispatch();

  let setFollow = async (followFunc) => {
    if (cv !== state?.owner?.cvID) {
      let hash = await _apiPost(followFunc, [parseInt(state?.owner?.cvID)]);
      doStateProfileTools({ dispatch, cvID: state?.owner?.cvID });
      checkFollow();
    }
  };
  return (
    <>
      <div className="card_social  h-full">
        <div className="background"></div>

        <div className="logo">
          <div className="flex">
            <div className="z-1    flex items-start flex-col">
              <Avatar CID={state?.owner?.metadatas?.image} />
              <h6 className="text-white text-lg">
                {state?.owner?.metadatas?.username}
              </h6>
              <p className="text-[10px] text-white/70 whitespace-nowrap">
                {state?.owner?.metadatas?.description}{" "}
              </p>
              <p className="text-[10px] text-white/70 whitespace-nowrap">
                {isFollower && "Vous suit"}
                {isFollow && "Vous suivez"}
              </p>
            </div>
          </div>
        </div>

        {cv != state?.owner?.cvID && cv && (
          <MyMainBtn
            setter={() => setFollow(isFollow ? "unfollowCV" : "followCV")}
            icon={icfyGITHUB2}
            style="ml-auto z-100 absolute bottom-2 right-2 "
          >
            {isFollow ? "Unfollow" : "Follow"}
          </MyMainBtn>
        )}
        <a href="#">
          <div className="box box1">
            <Icon
              icon={icfyGITHUB2}
              className="ml-auto z-100 text-2xl relative"
            />
          </div>
        </a>

        <a href="##">
          <div className="box box2">
            <Icon
              icon={icfyLINKEDIN}
              className="ml-auto z-100 text-2xl relative"
            />
          </div>
        </a>

        <a href="###">
          <div className="box box3">
            <Icon
              icon={icfyTWITTER}
              className="ml-auto z-100 text-2xl relative"
            />
          </div>
        </a>

        <div className="box box4"></div>
      </div>
    </>
  );
};
