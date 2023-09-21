"use client";

import { MyHeader } from "components/myComponents/MyHeader";
import { MySection } from "components/myComponents/MySection";
import { useAuthState } from "context/auth";
import { icfyCODE, icfyETHER, icfyGAMING, icfyLOCK, icfySTAR } from "icones";

// import { CVName } from "components/inputs/inputsCV/CVName";
// import { CreationMission, ListMission } from "components/inputs/inputsMission";

// import React, { useEffect } from "react";
// import { CreationFeatures } from "sections/Features";
import { Layout } from "sections/Layout";
import { themes } from "styles/style";
// import { MySection } from "components/myComponents/MySection";

const Mission = () => {
  const { cv, missionId } = useAuthState();

  return (
    <Layout>
      <MySection styles={" flex flex-col  justify-between "}>
        <MyHeader
          name={"Mission name"}
          desc2={"Domain name"}
          desc1={"Owner name"}
          stats={[
            {
              title: "Amount",
              value: "0.0000 $",
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
              value: "4",
              icon: icfyLOCK,
              theme: themes.launchpads,
            },
            {
              title: "Status",
              value: "Ouvert",
              icon: icfySTAR,
              theme: themes.missions,
            },
          ]}
          details={[
            {
              title: "Post(s)",
              value: 5,
            },
            {
              title: "Postulé",
              value: 0,
            },
            {
              title: "Job",
              value: "En attente",
            },
          ]}
        />
      </MySection>
      {/* <MySection styles={"flex-col"}>
        <h3 className="font-bold text-lg">
          {cv ? (
            <>
              Hi , <CVName /> !
            </>
          ) : (
            "Hi, you should registred before continue"
          )}{" "}
        </h3>

        <ListMission />
        {missionId !== null ? <CreationFeatures /> : <CreationMission />}
      </MySection> */}
    </Layout>
  );
};

export default Mission;
