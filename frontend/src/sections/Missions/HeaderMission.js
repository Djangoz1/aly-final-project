import { CreatePub } from "components/Pub/CreatePub";
import { CVName } from "components/inputs/inputsCV/CVName";
import { CreateFeature } from "components/modal/works/CreateFeature";
import { MyHeader } from "components/myComponents/MyHeader";
import { STATUS } from "constants/status";
import { icfyETHER, icfyGAMING, icfyLOCK, icfySTAR } from "icones";
import React from "react";
import { themes } from "styles/style";

export const HeaderMission = ({ path, owner, metadatas, datas }) => {
  return (
    <MyHeader
      path={
        path
          ? `/works/mission/${datas?.id}${path && path}`
          : `/works/mission/${datas?.id}`
      }
      menus={[
        {
          title: "Overview",
          link: `/works/mission/${datas?.id}`,
        },
        {
          title: "Features",
          link: `/works/mission/${datas?.id}/features`,
        },
        {
          title: "Budget",
          link: "/profile",
        },
        {
          title: "Pubs",
          link: "/profile",
        },
        {
          style: "ml-auto",
          component: <CreatePub />,
        },
        {
          style: "mx-4",
          component: <CreateFeature />,
        },
        {
          style: "join",
          component: (
            <>
              <input
                placeholder="Worker name"
                className="input input-xs join-item"
              />
              <button className="join-item btn text-white btn-xs btn-success">
                Invite Worker
              </button>
            </>
          ),
        },
      ]}
      img={metadatas?.image}
      name={metadatas?.title}
      desc2={metadatas?.attributes?.[0]?.domain}
      desc1={<CVName metadata={owner} />}
      stats={[
        {
          title: "Amount",
          value: `${datas?.amount} $`,
          icon: icfyETHER,
          theme: themes.pubs,
        },
        {
          title: "Domain",
          value: "Javascript",
          icon: icfyGAMING,
          theme: themes.proposals,
        },
        {
          title: "Jobs",
          value: datas?.features?.length,
          icon: icfyLOCK,
          theme: themes.launchpads,
        },
        {
          title: "Status",
          value: STATUS.feature[datas?.status]?.status,
          icon: icfySTAR,
          theme: themes.missions,
        },
      ]}
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
        {
          title: "Job",
          value: "En attente",
        },
      ]}
    />
  );
};
