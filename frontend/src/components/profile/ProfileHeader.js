import { Icon } from "@iconify/react";
import { ImagePin } from "components/Image/ImagePin";

import { useAuthState } from "context/auth";
import {
  icfy,
  icfyCODER,
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
import { themes } from "styles/style";
import { CreateMission } from "components/modal/works/CreateMission";
import { CreatePub } from "components/Pub/CreatePub";
import { DEV_DOMAIN } from "constants/languages";
import { fromTimestamp } from "utils/ux-tools";

export const ProfileHeader = ({ _state }) => {
  let { cv, metadatas, datas } = useAuthState();

  let [isState, setIsState] = useState({
    datas: null,
    metadatas: null,
  });

  useEffect(() => {
    if (isState?.datas !== null && isState?.metadatas !== null) return;
    if (_state) {
      setIsState({
        datas: _state?.datas,
        metadatas: _state?.metadatas,
      });
    } else {
      setIsState({
        datas: datas,
        metadatas: metadatas,
      });
    }
  }, [_state, datas, metadatas]);
  return (
    <MyHeader
      img={isState?.metadatas?.image}
      ownerID={cv}
      name={isState?.metadatas?.username}
      desc1={isState?.metadatas?.description}
      desc2={
        <>
          {isState?.datas?.missions > 0 && "Enterprise"}
          {isState?.datas?.missions > 0 &&
            isState?.datas?.proposals > 0 &&
            " & "}
          {isState?.datas?.proposals > 0 && "Worker"}
          <p className="mt-2 text-xs font-light text-white/30 ">
            Depuis le
            <span className="text-white/70 ml-2">
              {fromTimestamp(isState?.metadatas?.attributes?.[0]?.createdAt)}
            </span>
          </p>
        </>
      }
      stats={[
        {
          title: "Amount",
          value: `${isState?.datas?.amount.toFixed(4) || 0} $`,
          icon: icfyETHER,
          theme: `${themes.launchpads} `,
        },
        {
          title: "Missions",
          value: isState?.datas?.missions,
          icon: icfyMISSION,
          theme: `${themes.missions} `,
        },
        {
          title: "Domain",
          value: DEV_DOMAIN[isState?.metadatas?.attributes?.[0]?.domain]?.name,
          icon: DEV_DOMAIN[isState?.metadatas?.attributes?.[0]?.domain]?.icon,
          theme: `${themes.proposals} `,
        },
        {
          title: "Visibilité",
          value: (
            <span>
              {isState?.metadatas?.attributes?.[0]?.visibility === true
                ? "Disponible"
                : "Indisponible"}
            </span>
          ),
          icon: icfy.eye[
            isState?.metadatas?.attributes?.[0]?.visibility === true
              ? "open"
              : "close"
          ],
          theme: `${themes.pubs} `,
        },
      ]}
      menus={[
        {
          title: "Overview",
          link: "/profile",
        },
        {
          title: "Mission",
          link: "/",
        },
        {
          title: "Arbitrage",
          link: "/",
        },
        {
          title: "Jobs",
          link: "/",
        },
        {
          title: "Pubs",
          link: "/profile/pubs",
        },
        {
          style: "ml-auto",
          component: <CreatePub />,
        },
        {
          style: "ml-4",
          component: <CreateMission />,
        },
      ]}
      details={[
        { title: "Follower(s)", value: isState?.datas?.followers },
        { title: "Follow(s)", value: isState?.datas?.follows },
        { title: "Post(s)", value: isState?.datas?.pubs },
      ]}
    />
  );
};
