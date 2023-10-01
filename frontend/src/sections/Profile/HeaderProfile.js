import { Icon } from "@iconify/react";
import { ImagePin } from "components/Image/ImagePin";

import { doAuthCV, useAuthDispatch, useAuthState } from "context/auth";
import {
  icfy,
  icfyCODER,
  icfyCV,
  icfyETHER,
  icfyFB,
  icfyGITHUB2,
  icfyLINKEDIN,
  icfyMISSION,
  icfyROCKET,
  icfyTWITTER,
} from "icones";
import React, { useEffect, useState } from "react";

import { MyHeader } from "components/myComponents/MyHeader";
import { styles, themes } from "styles/style";
import { CreateMission } from "sections/works/Missions/form/create/CreateMission";
import { CreatePub } from "sections/Pub/form/create/CreatePub";
import { DEV_DOMAIN } from "constants/languages";
import { fromTimestamp } from "utils/ux-tools";
import { doStateCV, useCVDispatch, useCVState } from "context/hub/cv";
import { useAccount } from "wagmi";
import { _apiGet, _apiPost } from "utils/ui-tools/web3-tools";
import { EditProfile } from "./form/edit/EditProfile";
import { MENUS_ID } from "constants/menus";
import { EditWorker } from "sections/works/Features/form/edit/EditWorker";
import { MyHeaderCard } from "components/myComponents/card/MyHeaderCard";
import { BtnGb2, BtnGr2 } from "components/myComponents/btn/MyGradientButton";

export const HeaderProfile = ({ path }) => {
  let { cvID, datas, metadatas } = useCVState();
  let { cv } = useAuthState();
  let authState = useAuthState();
  let { address } = useAccount();
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

  console.log(datas, metadatas);

  let menus = MENUS_ID(cvID, cv, cvID).profile;

  if (
    metadatas?.attributes?.[0]?.visibility === true &&
    cv != cvID &&
    authState?.datas?.missions > 1
  ) {
    menus.push({ style: "ml-auto", component: <EditWorker /> });
  }

  useEffect(() => {
    if (cv > 0 && cvID > 0 && cv !== cvID) checkFollow();
  }, [cvID]);
  let { isConnected } = useAccount();
  return (
    <MyHeader
      path={path ? `/profile/${cvID}/${path}` : `/profile/${cvID}`}
      img={metadatas?.image}
      ownerID={cvID}
      name={metadatas?.username}
      desc1={metadatas?.description}
      desc2={
        <>
          {datas?.missions > 0 && "Enterprise"}
          {datas?.missions > 0 && datas?.proposals > 0 && " & "}
          {datas?.proposals > 0 && "Worker"}
          <p className="mt-2 text-xs font-light text-white/30 ">
            Depuis le
            <span className="text-white/70 ml-2">
              {fromTimestamp(metadatas?.attributes?.[0]?.createdAt)}
            </span>
          </p>
          <span className="text-xs text-white/60 my-1">
            {isFollower && "Vous suit"}
          </span>
        </>
      }
      menus={menus}
      details={[
        { title: "Follower(s)", value: datas?.followers },
        { title: "Follow(s)", value: datas?.follows },
        { title: "Post(s)", value: datas?.pubs },
      ]}
    />
  );
};
