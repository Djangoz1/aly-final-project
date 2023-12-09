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
import {
  FormCreateMission1,
  FormCreateMission2,
} from "sections/works/Missions/form/create/FormCreateMission";

import { FormResponseAI } from "sections/Form/FormResponseAI";
import { doStateTools, useToolsDispatch, useToolsState } from "context/tools";
import { controllers } from "utils/controllers";

const PageCreateProfile = () => {
  let { address, isConnected } = useAccount();
  let dispatch = useToolsDispatch();
  let { state, pointer } = useToolsState();
  let [price, setPrice] = useState(0.5); // ! balancesHub.missionPrice()
  let { metadatas, cv, datas } = useAuthState();

  _form_create_mission[0].title = (
    <>
      Salut <CVName metadata={metadatas} /> ! 👋
    </>
  );

  let submitForm = async (form) => {
    let _txs = { db: null, bc: null, result: null, submit: true };
    await doStateTools(dispatch, {
      ...state,
      txs: { pointer: 0, ..._txs },
    });

    let aiAssist = form?.aiAssisted;
    let metadatas = {
      description: aiAssist
        ? form?.ai?.recommandations?.detail
        : form?.description,
      abstact: aiAssist ? form?.ai?.recommandations?.abstract : form?.abstract,
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

    const record = await clientPocket.records.create("missions", metadatas);

    _txs.db = record;

    await doStateTools(dispatch, {
      ...state,
      txs: { pointer: 1, ..._txs },
    });

    //   ! Recuperation de l'ID
    let uri = record.id;

    //   ! Decoment for create mission only on db
    // return;

    let hash;
    let price = await _apiGetAt({
      func: "missionPrice",
      targetContract: "balancesHub",
    });

    console.log("ici", form);
    try {
      console.log("wtf", form);
      if (form?.launchpad >= 0 && form?.launchpad !== null) {
        hash = await _apiPost("createMissionLaunchpad", [
          datas?.launchpads[parseInt(form?.launchpad)],
          uri,
        ]);
      } else {
        console.log("wtf-----", form);
        hash = await _apiPostPayable("createMission", [uri], price);
      }
    } catch (error) {
      await clientPocket.records.delete("missions", uri);

      return;
    }

    let missionID = await _apiGet("tokensLengthOf", [ADDRESSES["missionsHub"]]);

    _txs.bc = hash;
    await doStateTools(dispatch, {
      ...state,
      txs: { pointer: 2, ..._txs },
    });

    if (aiAssist) {
      for (
        let index = 0;
        index < form?.ai?.recommandations?.roles.length;
        index++
      ) {
        let element = form?.ai?.recommandations?.roles[index];
        let datas = {
          missionID: missionID,
          missionHash: uri,
          title: element?.role_name,
          abstract: element?.reason,
          skills: JSON.stringify(element?.skills_required, null, 2),
        };

        await controllers.create.feature(datas);
      }
      _txs.result = `/works/mission/${missionID}`;
      await doStateTools(dispatch, {
        ...state,
        txs: { pointer: 3, ..._txs },
      });
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
