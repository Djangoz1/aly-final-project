"use client";

import { useAuthState } from "context/auth";

import { CVName } from "components/inputs/inputsCV/CVName";
import { CreationMission, ListMission } from "components/inputs/inputsMission";

import React, { useEffect } from "react";
import { CreationFeatures } from "sections/Features";
import { Layout } from "sections/Layout";

const Mission = () => {
  const { cv, missionId } = useAuthState();

  return (
    <Layout>
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
    </Layout>
  );
};

export default Mission;
