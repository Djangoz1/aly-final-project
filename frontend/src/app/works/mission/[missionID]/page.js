"use client";

import { CreatePub } from "components/Pub/CreatePub";
import { CVName } from "components/inputs/inputsCV/CVName";
import { CreateFeature } from "components/modal/works/CreateFeature";
import { MyHeader } from "components/myComponents/MyHeader";
import { MySection } from "components/myComponents/MySection";
import { MySideList } from "components/myComponents/MySideList";
import { ENUMS_COURTS, ENUMS_FEATURE_STATUS } from "constants/enums";
import { useAuthState } from "context/auth";
import {
  icfyCODE,
  icfyETHER,
  icfyGAMING,
  icfyLOCK,
  icfySTAR,
  icfyUNLOCK,
} from "icones";
import { useEffect, useState } from "react";

// import { CVName } from "components/inputs/inputsCV/CVName";
// import { CreationMission, ListMission } from "components/inputs/inputsMission";

// import React, { useEffect } from "react";
// import { CreationFeatures } from "sections/Features";
import { Layout } from "sections/Layout";
import { styles, themes } from "styles/style";
import { stateFeature, stateMission } from "utils/ui-tools/state-tools";
import { findBadges } from "utils/works/tools";
// import { MySection } from "components/myComponents/MySection";

const Mission = ({ params }) => {
  const missionID = params.missionID;
  const [isState, setIsState] = useState(null);
  const { cv } = useAuthState();
  let datas = isState?.mission?.datas;
  let metadatas = isState?.mission?.metadatas;

  useEffect(() => {
    // if (missionID && missionID > 0 && !isState) {
    if (missionID && missionID > 0) {
      state();
    }
  }, [missionID]);

  let state = async () => {
    let mission = await stateMission(missionID);
    let list = [];
    let features = [];
    for (let index = 0; index < mission?.datas?.features.length; index++) {
      const featureID = mission?.datas?.features[index];
      let feature = await stateFeature(featureID);
      features.push(feature);
      list.push({
        img: feature?.metadatas?.image,
        link: `/works/features/${featureID}`,
        details: [
          {
            title: "Wadge",
            value: feature?.datas?.wadge,
          },
          feature?.datas?.cvWorker > 0 && {
            title: "Temps restants",
            value: "12 min",
          },
          {
            title: "Status",
            value:
              feature?.datas?.cvWorker > 0
                ? ENUMS_FEATURE_STATUS[feature?.datas?.status]
                : "Waiting",
          },
        ],
        title: feature?.metadatas?.title,
        description: feature?.metadatas?.description,
        subContent: {
          theme: themes?.launchpads,
          title: "Technologie",
          arr: [
            {
              value: ENUMS_COURTS[feature?.datas?.specification]?.court,
              icon1: ENUMS_COURTS[feature?.datas?.specification]?.badge,
              icon2: feature?.datas?.isInviteOnly ? icfyLOCK : icfyUNLOCK,
            },
          ],
        },
      });
    }
    let result = { mission, list, features };
    setIsState(result);
  };

  return (
    <Layout>
      <MySection styles={" flex flex-col font2 justify-between "}>
        <MyHeader
          menus={[
            {
              title: "Overview",
              link: "/",
            },
            {
              title: "Features",
              link: "/profile",
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
          desc1={<CVName cvID={datas?.owner} />}
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
              value: ENUMS_FEATURE_STATUS[datas?.status],
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
        <div className="w-full flex">
          <div className="w-full flex py-5 px-2">
            <div className=" flex flex-col w-1/2">
              <h6 className="text-white">Description:</h6>
              <p className="text-justify">{metadatas?.description}</p>
            </div>
            <div className="flex w-1/2"></div>
          </div>
          <MySideList list={isState?.list} badges={isState?.mission?.badges} />
        </div>
      </MySection>
    </Layout>
  );
};

export default Mission;
