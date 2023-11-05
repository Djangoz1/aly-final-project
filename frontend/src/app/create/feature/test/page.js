"use client";
import { MyLayoutApp } from "components/myComponents/layout/MyLayoutApp";
import { Viewport } from "components/myComponents/layout/MyViewport";
import React from "react";

import { useAuthState } from "context/auth";

import { _form_create_feature } from "utils/ux-tools/form/feature";
import { MENUS_CREATE_FEATURE } from "constants/menus";
import { MySteps } from "components/myComponents/MySteps";
import { CVName } from "components/inputs/inputsCV/CVName";
import {
  moock_create_feature,
  moock_create_feature_placeholders,
} from "constants/moock";
import PocketBase from "pocketbase";
import { createURIFeature } from "utils/ui-tools/pinata-tools";
import { _apiPost, _apiPostPayable } from "utils/ui-tools/web3-tools";
import { ethers } from "ethers";
import { MyFormInfo } from "components/myComponents/form/MyFormInfo";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { icfy } from "icones";
import { MyFormCreate } from "components/myComponents/form/MyForm";
import {
  FormCreateFeature1,
  FormCreateFeature2,
} from "sections/works/Features/form/create/FormCreateFeature";
import { useToolsState } from "context/tools";
import { useRouter } from "next/navigation";
const PageCreateFeature = () => {
  let { datas, metadatas, cv } = useAuthState();
  let account = useAuthState();

  let { state } = useToolsState();
  let router = useRouter();
  let form = _form_create_feature;
  form[0].title = (
    <>
      Salut <CVName metadata={metadatas} /> ! 👋
    </>
  );

  form[0].info =
    datas?.missions?.length == 0 ? (
      <span className="text-error">Please create mission first</span>
    ) : undefined;

  form[0].error = datas?.missions?.length == 0 ? true : undefined;

  let submitForm = async (form) => {
    const client = new PocketBase("http://127.0.0.1:8090");

    const resultList = await client.records.getList("missions", 1, 50, {
      filter: 'created >= "2022-01-01 00:00:00"',
    });

    console.log(resultList);

    let metadatas = {
      description: form?.description,
      title: form?.title,
      image: form?.image,
      domain: parseInt(form?.domain),
      missionID: resultList?.[0]?.id, // ! Change to cvID
    };

    console.log("metadatas, ,", metadatas);
    const record = await client.records.create("features", metadatas);
    console.log("record, ,", record);

    //   ! Decoment for create mission on blockchain

    let missionID = state?.missions[parseInt(form?.missionID)]?.id;

    //   ! Recuperation de l'ID
    let uri = record.id;

    // ! Decoment pour faire la transaction blockchain
    let estimatedDays = parseInt(form?.estimatedDays);
    if (missionID > 0 && estimatedDays > 0) {
      let value = await ethers.utils.parseEther(form?.wadge);

      await _apiPostPayable(
        "createFeature",
        [
          missionID,
          estimatedDays,
          form?.onlyInvite,
          uri,
          parseInt(form?.specification),
        ],
        value._hex
      );
    }

    //   router.push("/works/mission/" + missionID + "#section2");
  };

  return (
    <MyLayoutApp
      url={"/create/feature"}
      initState={{ allowed: true }}
      target={"feature"}
    >
      <MyFormCreate
        title={"Create Feature"}
        side={<MySteps arr={MENUS_CREATE_FEATURE} />}
        stateInit={{
          allowed: true,
          form: moock_create_feature,
          placeholders: moock_create_feature_placeholders,
          checked: [
            [],
            [],
            [],
            // ["title", "domain", "description"],
            // ["missionID", "specification", "wadge", "worker", "estimatedDays"],
          ],
        }}
        btn={"Create feature"}
        arr={form}
        components={[
          {},
          { component: <FormCreateFeature1 />, label: "Blockchain" },
          { component: <FormCreateFeature2 />, label: "Lorem" },
        ]}
        submit={submitForm}
      />
    </MyLayoutApp>
  );
};

export default PageCreateFeature;
