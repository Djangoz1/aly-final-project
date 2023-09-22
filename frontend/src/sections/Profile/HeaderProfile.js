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
import { useCVState } from "context/hub/cv";

export const HeaderProfile = ({ path }) => {
  let { cvID, datas, metadatas } = useCVState();

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
        </>
      }
      stats={[
        {
          title: "Amount",
          value: `${datas?.amount.toFixed(4) || 0} $`,
          icon: icfyETHER,
          theme: `${themes.launchpads} `,
        },
        {
          title: "Missions",
          value: datas?.missions,
          icon: icfyMISSION,
          theme: `${themes.missions} `,
        },
        {
          title: "Domain",
          value: DEV_DOMAIN[metadatas?.attributes?.[0]?.domain]?.name,
          icon: DEV_DOMAIN[metadatas?.attributes?.[0]?.domain]?.icon,
          theme: `${themes.proposals} `,
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
          icon: icfy.eye[
            metadatas?.attributes?.[0]?.visibility === true ? "open" : "close"
          ],
          theme: `${themes.pubs} `,
        },
      ]}
      menus={[
        {
          title: "Overview",
          link: `/profile/${cvID}`,
        },
        {
          title: "Missions",
          link: `/profile/${cvID}/missions`,
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
          link: `/profile/${cvID}/pubs`,
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
        { title: "Follower(s)", value: datas?.followers },
        { title: "Follow(s)", value: datas?.follows },
        { title: "Post(s)", value: datas?.pubs },
      ]}
    />
  );
};
