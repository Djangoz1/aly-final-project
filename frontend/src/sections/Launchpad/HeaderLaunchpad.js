import { CreatePub } from "sections/Pub/form/create/CreatePub";
import { CVName } from "components/inputs/inputsCV/CVName";
import { CreateFeature } from "sections/works/Features/form/create/CreateFeature";
import { MyHeader } from "components/myComponents/MyHeader";
import { ENUMS } from "constants/enums";
import { MENUS, MENUS_ID } from "constants/menus";
import { STATUS } from "constants/status";
import { useMissionState } from "context/hub/mission";
import {
  icfyETHER,
  icfyGAMING,
  icfyLOCK,
  icfyROCKET,
  icfySTAR,
  icfyTIME,
} from "icones";
import React from "react";
import { themes } from "styles/style";
import { fromTimestamp, timestampToCounter } from "utils/ux-tools";
import { useLaunchpadState } from "context/hub/launchpad";
import { ethers } from "ethers";
import { MyCountdown } from "components/myComponents/MyCountdown";
import { Icon } from "@iconify/react";
import { MyHeaderCard } from "components/myComponents/card/MyCardList";

export const HeaderLaunchpad = ({ path }) => {
  let { metadatas, datas, owner } = useLaunchpadState();

  let domain = ENUMS.domain[metadatas?.attributes?.[0]?.domain];
  let attributes = metadatas?.attributes?.[0];

  let menus = MENUS_ID(datas?.id).launchpad;

  return (
    <MyHeader
      path={
        path
          ? `/launchpad/${datas?.id}${path && path}`
          : `/launchpad/${datas?.id}`
      }
      menus={menus}
      img={metadatas?.image}
      name={metadatas?.title}
      desc1={<p>Créer le {fromTimestamp(attributes?.createdAt)}</p>}
      details={[
        {
          title: "Post(s)",
          value: datas?.pubs?.length,
        },
        {
          title: "Status",
          value: STATUS.launchpad?.[datas?.status]?.status,
        },
        {
          title: "Worker(s)",
          value: datas?.workers,
        },
      ]}
    />
  );
};
