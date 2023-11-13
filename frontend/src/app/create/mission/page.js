"use client";
import { MyLayoutApp } from "components/myComponents/layout/MyLayoutApp";
import React, { useEffect, useState } from "react";

import { _form_create_profile } from "utils/ux-tools/form/profile";

import { useAccount } from "wagmi";

import { _apiGet, _apiPost, _apiPostPayable } from "utils/ui-tools/web3-tools";
import { useAuthDispatch } from "context/auth";

import { Icon } from "@iconify/react";

import { MyFormCreate } from "components/myComponents/form/MyForm";

import { useAuthState } from "context/auth";

import { MySteps } from "components/myComponents/MySteps";
import { MENUS_CREATE_MISSION } from "constants/menus";

import { _form_create_mission } from "utils/ux-tools/form/mission";

import {
  moock_create_mission,
  moock_create_mission_placeholder,
} from "constants/moock";

import { _apiGetAt } from "utils/ui-tools/web3-tools";
import { ADDRESSES } from "constants/web3";
import { ethers } from "ethers";
import { MyFormInfo } from "components/myComponents/form/MyFormInfo";

import { icfyETHER } from "icones";
import { CVName } from "components/inputs/inputsCV/CVName";
import { createURI } from "utils/ui-tools/pinata-tools";
import { useCVState } from "context/hub/cv";
import {
  FormCreateMission1,
  FormCreateMission2,
} from "sections/works/Missions/form/create/FormCreateMission";
import { MyLoader } from "components/myComponents/layout/MyLoader";
import PocketBase from "pocketbase";
import { TextAI } from "components/myComponents/text/TextAI";
import { FormResponseAI } from "sections/Form/FormResponseAI";

const PageCreateProfile = () => {
  let { address, isConnected } = useAccount();
  let dispatch = useAuthDispatch();

  let [price, setPrice] = useState(0.5); // ! balancesHub.missionPrice()
  let { metadatas, cv } = useAuthState();
  let { cvID } = useCVState();

  _form_create_mission[0].title = (
    <>
      Salut <CVName metadata={metadatas} /> ! 👋
    </>
  );

  let submitForm = async (form) => {
    const client = new PocketBase("http://127.0.0.1:8090");

    let metadatas = {
      description: form?.description,
      title: form?.title,
      image: form?.image,
      banniere: form?.banniere,
      reference: form?.reference ? parseInt(form?.reference) : undefined,

      domain: parseInt(form?.domain),
      owner: 1, // ! Change to cvID
    };

    console.log("metadatas, ,", metadatas);
    const record = await client.records.create("missions", metadatas);
    console.log("record, ,", record);

    //   ! Recuperation de l'ID
    let uri = record.id;

    //   ! Decoment for create mission on blockchain
    // await _apiPostPayable(
    //   "createMission",
    //   [uri],
    //   ethers?.utils?.parseEther(form?.price)
    // );
  };

  return (
    <MyLayoutApp
      target={"mission"}
      url={"/create/mission"}
      initState={{ allowed: true }}
    >
      <MyFormCreate
        title={"Create Mission"}
        submit={submitForm}
        stateInit={{
          allowed: price ? true : undefined,
          form: { ...moock_create_mission, price },
          placeholders: moock_create_mission_placeholder,
          checked: [[], []],
        }}
        side={<MySteps arr={MENUS_CREATE_MISSION} />}
        arr={_form_create_mission}
        components={[
          {
            component: (
              <MyFormInfo
                title={
                  <>
                    <Icon
                      icon={icfyETHER}
                      className="mr-2 text-white text-2xl"
                    />
                    <span>{price} ETH</span>
                  </>
                }
              />
            ),
            label: "Information",
          },
          {
            component: <FormCreateMission1 />,
            label: "Blockchain",
          },
          {
            component: <FormCreateMission2 />,
            label: "Dontkno",
          },
          {
            component: <FormResponseAI />,
            label: "Dontkno",
          },
        ]}
      />
    </MyLayoutApp>
  );
};

export default PageCreateProfile;
