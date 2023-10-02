import { CreatePub } from "sections/Pub/form/create/CreatePub";
import { CVName } from "components/inputs/inputsCV/CVName";
import { CreateFeature } from "sections/works/Features/form/create/CreateFeature";
import { MyHeader } from "components/myComponents/MyHeader";
import { ENUMS } from "constants/enums";
import { MENUS, MENUS_ID } from "constants/menus";
import { STATUS } from "constants/status";
import { useMissionState } from "context/hub/mission";
import { icfyETHER, icfyGAMING, icfyLOCK, icfySTAR } from "icones";
import React from "react";
import { themes } from "styles/style";
import { fromTimestamp } from "utils/ux-tools";

export const HeaderMission = ({ path, owner }) => {
  let state = useMissionState();
  let datas = state?.mission?.datas;
  let metadatas = state?.mission?.metadatas;
  let domain = ENUMS.domain[metadatas?.attributes?.[0]?.domain];
  let attributes = metadatas?.attributes?.[0];

  let menus = MENUS_ID(datas?.id).mission;

  return (
    <MyHeader
      path={
        path
          ? `/works/mission/${datas?.id}${path && path}`
          : `/works/mission/${datas?.id}`
      }
      menus={menus}
      img={metadatas?.image}
      name={metadatas?.title}
      desc1={<p>Créer le {fromTimestamp(attributes?.createdAt)}</p>}
      desc2={<CVName metadata={owner} />}
      details={[
        {
          title: "Post(s)",
          value: datas?.pubs?.length,
        },
        {
          title: "Postulé",
          value: 0,
        },
        {
          title: "Worker(s)",
          value: datas?.workers,
        },
      ]}
    />
  );
};
