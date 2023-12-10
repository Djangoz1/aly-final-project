"use client";
import { MyLayoutApp } from "components/myComponents/layout/MyLayoutApp";
import { Viewport } from "components/myComponents/layout/MyViewport";
import React from "react";

import { useAuthState } from "context/auth";

import { _form_create_feature } from "utils/ux-tools/form/feature";
import { MENUS_CREATE_FEATURE } from "constants/menus";
import { MySteps } from "components/myComponents/MySteps";
import { CVName } from "components/links/CVName";
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
import { controllers } from "utils/controllers";
import { stateMission } from "utils/ui-tools/state-tools";
import { ENUMS } from "constants/enums";
const PageCreateFeature = () => {
  let { datas, metadatas, cv } = useAuthState();
  let account = useAuthState();

  let { state } = useToolsState();
  console.log("state", state);

  let router = useRouter();
  let form = _form_create_feature;
  form[0].title = (
    <>
      Salut <CVName metadata={metadatas} /> ! 👋
    </>
  );

  let moock = moock_create_feature;
  form[0].info =
    datas?.missions?.length == 0 ? (
      <span className="text-error">Please create mission first</span>
    ) : undefined;

  form[0].error = datas?.missions?.length == 0 ? true : undefined;
  console.log("-------------------------");

  let submitForm = async (form) => {
    let missionID = datas?.missions[parseInt(form?.missionID || 0n)];
    let value = await ethers.utils.parseEther(form?.wadge);
    let mission = await stateMission(missionID);

    let _form = {
      description: form?.aiAssisted
        ? `${form?.ai?.recommandations?.roles?.[0]?.reason}
      ${form?.ai?.recommandations?.detail}
      `
        : form?.description,
      title: form?.title,
      image: form?.image,
      abstract: form?.aiAssisted
        ? form?.ai?.recommandations?.abstract
        : form?.abstract,
      domain: parseInt(form?.domain),

      skills: form?.aiAssisted
        ? form?.ai?.recommandations?.roles?.[0]?.skills_required
        : form?.skills,
      missionHash: mission?.metadatas?.id, // ! Change to cvID
      missionID: missionID,
      launchpadID: mission?.datas?.launchpad,
      value: value._hex,
      deployed: true,
      featureHash: form?.featureHash,
      specification: parseInt(form.specification),
      estimatedDays: parseInt(form.estimatedDays),
      isInviteOnly: form.onlyInvite,
    };

    console.log("----------", _form);

    let test = await controllers.create.feature(_form);

    console.log("state -----", test);

    //   router.push("/mission/" + missionID + "#section2");
  };

  return (
    <MyLayoutApp
      url={"/create/feature"}
      initState={{ form: state?.form, allowed: true }}
      target={"feature"}
    >
      <MyFormCreate
        title={"Create Feature"}
        side={<MySteps arr={MENUS_CREATE_FEATURE} />}
        stateInit={{
          allowed: true,
          form: {
            ...moock,
            target: "feature",
            title: state?.form?.feature?.title || null,
            description: state?.form?.feature?.description,
            missionID: datas?.missions
              ?.map((el, i) => (el == state?.form?.missionID ? i : undefined))
              ?.filter((el) => el !== undefined)?.[0],
            featureHash: state?.form?.feature?.id,
            abstract: state?.form?.feature?.abstract,
            skills: state?.form?.skills,
          },
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
