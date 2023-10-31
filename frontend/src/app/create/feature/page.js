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
import {
  doStateMission,
  useMissionDispatch,
  useMissionState,
} from "context/hub/mission";
import { createURIFeature } from "utils/ui-tools/pinata-tools";
import { _apiPost } from "utils/ui-tools/web3-tools";
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
const PageCreateFeature = () => {
  let { datas, metadatas, cv } = useAuthState();
  let account = useAuthState();

  let { missionID, mission } = useMissionState();
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
  let dispatch = useMissionDispatch();

  let submitForm = async (form) => {
    console.log("form", form);
    let uri = await createURIFeature(form);
    let missionID = parseInt(form?.missionID);
    let estimatedDays = parseInt(form?.estimatedDays);

    if (missionID > 0 && estimatedDays > 0) {
      let value = await ethers.utils.parseEther(form?.wadge);
      await _apiPost(
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
    doStateMission(dispatch, missionID);
  };

  moock_create_feature.missionID = missionID;
  console.log("datas", account);
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
