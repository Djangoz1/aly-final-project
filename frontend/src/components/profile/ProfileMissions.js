import { Icon } from "@iconify/react";
import { ImagePin } from "components/Image/ImagePin";

import { icfyLOCK, icfyUNLOCK } from "icones";
import React, { useEffect, useState } from "react";
import { themes, uxcomponent } from "styles/style";
import { stateFeature, stateMission } from "utils/ui-tools/state-tools";
import { fetchMissionsOfCV } from "utils/works";
import { v4 as uuidv4 } from "uuid";

import { ENUMS_COURTS } from "constants/enums";
import Link from "next/link";
import { MySideList } from "components/myComponents/MySideList";
import { findBadges } from "utils/works/tools";
import { useAuthState } from "context/auth";

export const ProfileMissions = ({ cvID }) => {
  let [isState, setIsState] = useState({ list: null, badges: null });
  let { cv } = useAuthState();
  let state = async () => {
    let missions = await fetchMissionsOfCV(cvID || cv);
    let _features = [];
    let arrState = [];
    let features = [];
    for (let index = 0; index < missions?.length; index++) {
      let element = missions[index];
      let mission = await stateMission(element?.id);

      for (let index = 0; index < mission?.datas?.features.length; index++) {
        const id = mission?.datas?.features[index];
        const feature = await stateFeature(id);

        features.push(feature);
        _features.push({
          value: feature?.metadatas?.title,
          icon1: ENUMS_COURTS?.[feature?.datas?.specification]?.badge,
          icon2: feature?.datas?.isInviteOnly ? icfyLOCK : icfyUNLOCK,
          styleIc2: !feature?.datas?.isInviteOnly
            ? "text-green-600"
            : "text-red-600",
        });
      }

      arrState.push({
        img: mission?.metadatas?.image,
        title: mission?.metadatas?.title,
        link: `/works/mission/${mission?.datas?.id}`,
        details: [
          {
            value: mission?.datas?.amount,
            title: "Budget",
          },
          {
            value: mission?.datas?.workers,
            title: "Worker(s)",
          },
          {
            value: mission?.datas?.pubs?.length,
            title: "Post(s)",
          },
        ],
        description: mission?.metadatas?.description,
        subContent: {
          title: "Jobs",
          theme: themes.missions,
          arr: _features,
        },
      });
    }

    let badges = await findBadges({ features: features });

    setIsState({ list: arrState, badges });
  };

  useEffect(() => {
    if ((cvID || cv) && isState.list === null && isState.badges === null)
      state();
  }, [cvID, cv]);

  return (
    <MySideList list={isState?.list} badges={isState?.badges} />
    // <div className="flex max-h-[80vh]   w-[30%]">
    //   <div className="flex h-full overflow-y-scroll hide-scrollbar flex-col   w-full">
    //     {isMissions?.map((mission) => (
    //       <Element datas={mission} key={uuidv4()} />
    //     ))}
    //   </div>
    //   <MyBadgesBar datas={isMissions} />
    // </div>
  );
};
