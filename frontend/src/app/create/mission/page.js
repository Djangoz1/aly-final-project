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
import { clientPocket, createURI } from "utils/ui-tools/pinata-tools";
import { useCVState } from "context/hub/cv";
import {
  FormCreateMission1,
  FormCreateMission2,
} from "sections/works/Missions/form/create/FormCreateMission";
import { MyLoader } from "components/myComponents/layout/MyLoader";
import PocketBase from "pocketbase";
import { TextAI } from "components/myComponents/text/TextAI";
import { FormResponseAI } from "sections/Form/FormResponseAI";
import { doStateTools, useToolsDispatch, useToolsState } from "context/tools";

const PageCreateProfile = () => {
  let { address, isConnected } = useAccount();
  let dispatch = useToolsDispatch();
  let { state, pointer } = useToolsState();
  let [price, setPrice] = useState(0.5); // ! balancesHub.missionPrice()
  let { metadatas, cv } = useAuthState();
  let { cvID } = useCVState();

  _form_create_mission[0].title = (
    <>
      Salut <CVName metadata={metadatas} /> ! 👋
    </>
  );

  let submitForm = async (form) => {
    let _txs = { db: null, bc: null, submit: true };
    await doStateTools(dispatch, {
      ...state,
      txs: { pointer: 0, ..._txs },
    });
    const client = new PocketBase("http://127.0.0.1:8090");
    console.log("before submit", form?.ai);
    let aiAssist = form?.aiAssisted;
    let metadatas = {
      description: aiAssist
        ? form?.ai?.recommandations?.detail
        : form?.description,
      abstact: aiAssist && form?.ai?.recommandations?.abstract,
      title: aiAssist ? form?.ai?.recommandations?.name : form?.title,
      budget: aiAssist
        ? form?.ai?.recommandations?.budget?.total
        : form?.budget,
      image: form?.image,
      banniere: form?.banniere,
      reference: form?.reference ? parseInt(form?.reference) : undefined,

      domain: parseInt(form?.domain),
      owner: cv,
    };

    const record = await client.records.create("missions", metadatas);
    console.log("jai eu le record", record);
    _txs.db = record;

    await doStateTools(dispatch, {
      ...state,
      txs: { pointer: 1, ..._txs },
    });

    //   ! Recuperation de l'ID
    let uri = record.id;

    //   ! Decoment for create mission on blockchain
    // return;

    let price = await _apiGetAt({
      func: "missionPrice",
      targetContract: "balancesHub",
    });

    try {
      let hash = await _apiPostPayable("createMission", [uri], price);
      _txs.bc = hash;
      await doStateTools(dispatch, {
        ...state,
        txs: { pointer: 2, ..._txs },
      });
      let _featureMetadatas = [];
      for (
        let index = 0;
        index < form?.ai?.recommandations?.roles.length;
        index++
      ) {
        const element = form?.ai?.recommandations?.roles[index];
        let _metadatasFeature = {
          title: element?.role_name,
          abstract: element?.reason,
          skills: JSON.stringify(element?.skills_required, null, 2),
          budget: form?.ai?.recommandations?.budget?.roles_budget?.[index] || 0,
          missionID: uri,
          deployed: false,
        };
        console.log("_metadatas", _metadatasFeature);
        await clientPocket.records.create("features", _metadatasFeature);
        _featureMetadatas.push(_metadatasFeature);
        console.log(_featureMetadatas);
      }
    } catch (error) {
      await clientPocket.records.delete("missions", uri);
      console.log("missions delete");
    }
  };

  useEffect(() => {
    (async () => {
      if (!price) {
        setPrice(
          ethers.formatEther(
            await _apiGetAt({
              func: "missionPrice",
              targetContract: "balancesHub",
            })
          )
        );
      }
    })();
  }, []);

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
          form: {
            ...moock_create_mission,
            price,
          },
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
        ]}
      >
        {pointer === 3 ? <FormResponseAI /> : undefined}
      </MyFormCreate>
    </MyLayoutApp>
  );
};

export default PageCreateProfile;
