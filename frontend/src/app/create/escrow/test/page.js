"use client";
import { MyLayoutApp } from "components/myComponents/layout/MyLayoutApp";
import React, { useEffect, useState } from "react";

import { _form_create_profile } from "utils/ux-tools/form/profile";

import { useAccount } from "wagmi";

import { _apiGet, _apiPost } from "utils/ui-tools/web3-tools";
import { useAuthDispatch } from "context/auth";

import { Icon } from "@iconify/react";

import { MyFormCreate } from "components/myComponents/form/MyForm";

import { useAuthState } from "context/auth";

import { MySteps } from "components/myComponents/MySteps";
import { MENUS, MENUS_CREATE_MISSION } from "constants/menus";

import { _form_create_mission } from "utils/ux-tools/form/mission";

import {
  moock_create_escrow,
  moock_create_escrow_placeholder,
  moock_create_mission,
  moock_create_mission_placeholder,
} from "constants/moock";

import { _apiGetAt } from "utils/ui-tools/web3-tools";
import { ADDRESSES } from "constants/web3";
import { ethers } from "ethers";
import { MyFormInfo } from "components/myComponents/form/MyFormInfo";

import { icfyETHER } from "icones";
import { CVName } from "components/inputs/inputsCV/CVName";
import {
  clientPocket,
  createURI,
  fetchJSONByCID,
} from "utils/ui-tools/pinata-tools";
import { useCVState } from "context/hub/cv";
import {
  FormCreateMission1,
  FormCreateMission2,
} from "sections/works/Missions/form/create/FormCreateMission";
import { _form_create_escrow } from "../../../../utils/ux-tools/form/escrow";
import { FormCreateEscrow1 } from "sections/works/Escrows/form/create/FormCreateEscrow";
import { useToolsState } from "context/tools";
import { stateFeature } from "utils/ui-tools/state-tools";
import { STATUS } from "constants/status";

const PageCreateEscrow = () => {
  let { address, isConnected } = useAccount();
  let dispatch = useAuthDispatch();

  let { metadatas, cv } = useAuthState();
  let { cvID } = useCVState();
  let { state } = useToolsState();
  let tools = useToolsState();
  let [isState, setIsState] = useState(null);
  let stateInit = async () => {
    let jobs = await _apiGet("jobsOfCV", [cv]);

    let features = await _apiGet("indexerOfToken", [
      cv,
      ADDRESSES["featuresHub"],
    ]);

    let arr = [];
    for (let index = 0; index < jobs?.length; index++) {
      let id = jobs[index];
      let feature = await stateFeature(id);
      if (feature?.datas?.status == 0 || feature?.datas?.status == 1)
        arr.push({
          title: "#" + parseInt(id) + " " + feature?.metadatas.title + " - job",
          id,
          max: await _apiGet("lengthOfCourt", [feature?.datas?.specification]),
        });
    }
    for (let index = 0; index < features?.length; index++) {
      let id = features[index];

      let feature = await stateFeature(id);

      if (
        (feature?.datas?.status == 0 || feature?.datas?.status == 1) &&
        feature?.datas?.startedAt > 0
      )
        arr.push({
          title:
            "#" + parseInt(id) + " " + feature?.metadatas.title + " - owner",
          id,
          max: await _apiGet("lengthOfCourt", [feature?.datas?.specification]),
        });
    }

    setIsState({ arr });
  };

  useEffect(() => {
    if (!isState && cv > 0) {
      stateInit();
    }
  }, [cv]);

  _form_create_escrow[0].title = (
    <>
      Salut <CVName metadata={metadatas} /> ! 👋
    </>
  );

  let submitForm = async (form) => {
    let id = parseInt(state?.arr?.[parseInt(form?.feature)]?.id);
    console.log("wshhh start");
    let metadatas = {
      description: form.description,
      image: form?.image,
    };

    if (form?.appeal > 0 && form?.arbitrators >= 3) {
      const record = await clientPocket.records.create("escrows", metadatas);
      let uri = record?.id;
      console.log(
        "r888888676454345345345345345345345345345345345345345345345345ecord",
        record
      );
      let hash = await _apiPost("contestFeature", [
        id,
        parseInt(form?.appeal),
        parseInt(form?.arbitrators),
        uri,
      ]);

      let disputeID = await _apiGet("disputeOfFeature", [id]);

      hash = await _apiPost("initDispute", [disputeID]);
    } else {
      throw new Error("Missing escrow values");
    }
  };

  return (
    <MyLayoutApp target={"escrow"} url={"/create/escrow"} initState={isState}>
      <MyFormCreate
        title={"Create Escrow"}
        submit={submitForm}
        stateInit={{
          allowed: true,
          form: moock_create_escrow,
          placeholders: moock_create_escrow_placeholder,
          checked: [[], []],
        }}
        side={<MySteps arr={MENUS.escrow.create} />}
        arr={_form_create_escrow}
        components={[
          {
            label: "Information",
          },
          {
            component: <FormCreateEscrow1 />,
            label: "Blockchain",
          },
        ]}
      />
    </MyLayoutApp>
  );
};

export default PageCreateEscrow;
