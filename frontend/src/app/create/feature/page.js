"use client";
import { MyLayoutApp } from "components/myComponents/layout/MyLayoutApp";
import React from "react";

import { useAuthState } from "context/auth";

import { MOOCK } from "constants/moock";

import { _apiPost, _apiPostPayable } from "utils/ui-tools/web3-tools";
import { ethers } from "ethers";
import { MyFormCreate } from "components/myComponents/form/MyForm";
import { useToolsState } from "context/tools";
import { useRouter } from "next/navigation";
import { controllers } from "utils/controllers";
import { stateMission } from "utils/ui-tools/state-tools";
import { ENUMS } from "constants/enums";
import {
  FormInputsAI,
  FormResponseAI,
  formLabelAI,
} from "sections/Form/FormResponseAI";
import { MySelect } from "components/myComponents/form/MySelects";
import { Icon } from "@iconify/react";
import { MissionName } from "components/links/MissionName";
import { MyInputFile } from "components/myComponents/form/MyInputsFile";
import { MyInput } from "components/myComponents/form/MyInput";
import { MyTextArea } from "components/myComponents/form/MyTextArea";
const PageCreateFeature = () => {
  let { datas, metadatas, cv } = useAuthState();
  let account = useAuthState();

  let { state } = useToolsState();

  let router = useRouter();

  let moock = { ...MOOCK.feature.form };

  let submitForm = async (form) => {
    let missionID = datas?.missions[parseInt(form?.missionID || 0n)];
    let value = await ethers.utils.parseEther(form?.wadge);
    let mission = await stateMission(missionID);
    let aiAssisted = form?.ai?.recommandations ? true : false;

    let ai = form?.ai?.recommandations;
    let _form = {
      description: aiAssisted
        ? `${ai?.name}<br/>${ai?.abstract}<br/>${ai?.detail}`
        : form?.description,
      title: ai?.roles?.[0]?.role_name || form?.title,
      image: form?.image,
      abstract: aiAssisted ? ai?.roles?.[0]?.reason : form?.abstract,
      domain: parseInt(form?.domain),

      skills: aiAssisted
        ? JSON.stringify(ai?.roles?.[0]?.skills_required, null, 2)
        : JSON.stringify(form?.skills, null, 2),
      missionHash: mission?.metadatas?.id, // ! Change to cvID
      missionID: missionID,
      launchpadID: mission?.datas?.launchpad,
      value: value._hex,
      deployed: true,
      featureHash: form?.featureHash,
      specification: parseInt(form.specification),
      estimatedDays: parseInt(form.estimatedDays),
      isInviteOnly: form.onlyInvite > 0 ? false : true,
    };

    console.log("----------", _form);

    let test = await controllers.create.feature(_form);

    console.log("state -----", test);

    return test;
    //   router.push("/mission/" + missionID + "#section2");
  };

  return (
    <MyLayoutApp
      url={"/create/feature"}
      initState={{ form: state?.form, allowed: true }}
      target={"feature"}
    >
      <MyFormCreate
        template={1}
        submit={submitForm}
        stateInit={{
          allowed: true,
          form: {
            ...moock,
            title: state?.form?.feature?.title || null,
            description: state?.form?.feature?.description,
            missionID: datas?.missions
              ?.map((el, i) => (el == state?.form?.missionID ? i : undefined))
              ?.filter((el) => el !== undefined)?.[0],
            featureHash: state?.form?.feature?.id,
            abstract: state?.form?.feature?.abstract,
            skills: state?.form?.skills,
          },
          checked: [
            [],
            [],
            [],
            // ["title", "domain", "description"],
            // ["missionID", "specification", "wadge", "worker", "estimatedDays"],
          ],
        }}
        components={
          datas?.missions?.length
            ? [
                {
                  component: <FormInputsAI />,
                  label: formLabelAI,
                },
                {
                  component: (
                    <MySelect
                      style={"w-1/3 justify-center  flex-wrap mx-auto"}
                      target={"domain"}
                      arr={ENUMS.domain.map((el) => (
                        <>
                          <Icon icon={el?.icon} />
                          {el.name}
                        </>
                      ))}
                    ></MySelect>
                  ),
                  label: "What is the domain of your feature ?",
                },
                {
                  component: (
                    <MySelect
                      style={"w-1/3 justify-center  flex-wrap mx-auto"}
                      target={"specification"}
                      arr={ENUMS.courts.map((el) => (
                        <>
                          <Icon icon={el?.badge} />
                          {el.court}
                        </>
                      ))}
                    ></MySelect>
                  ),
                  label: "What is the specific technology of your feature ?",
                },
                {
                  component: (
                    <MySelect
                      style={"w-1/2 justify-center  flex-wrap mx-auto"}
                      target={"missionID"}
                      arr={datas?.missions.map((el) => (
                        <MissionName id={el} url={false} />
                      ))}
                    ></MySelect>
                  ),

                  label: "For wich mission would you like to create feature ?",
                },
                {
                  component: <MyInputFile target={"image"} />,
                  label: "Do you want add an image for your feature ?",
                },
                {
                  component: (
                    <div className="w-full flex flex-col gap-2">
                      <MyInput
                        styles={"w-full"}
                        target={"title"}
                        label={false}
                      />
                      <MyTextArea
                        styles={"min-h-[10vh] max-h-[20vh]  "}
                        target={"abstract"}
                        label={false}
                      />
                    </div>
                  ),
                  label: "Please provide a short informations for your feature",
                },
                {
                  component: (
                    <MyTextArea
                      styles={"min-h-[25vh] max-h-fit  "}
                      target={"description"}
                      label={false}
                    />
                  ),
                  label: "Please provide details informations for your feature",
                },
                {
                  component: (
                    <div className="flex flex-col w-full gap-1">
                      <MyInput
                        styles={"w-full"}
                        label={false}
                        target={"wadge"}
                        type={"number"}
                      />

                      <MyInput
                        label={false}
                        styles={"w-full"}
                        target={"estimatedDays"}
                        type={"number"}
                      />
                    </div>
                  ),
                  label:
                    "Please provide wadge and estimated days to your feature",
                },
                {
                  component: (
                    <MySelect
                      style={"w-1/3 justify-center  flex-wrap mx-auto"}
                      target={"onlyInvite"}
                      arr={[
                        "✋ Only on invitations",
                        "👍 Open to all",
                        "plus d'1 mission",
                        "plus de 3 missions",
                        "plus de 5 missions",
                        "plus de 10 missions",
                      ]}
                    ></MySelect>
                  ),
                  label: "Do you want open candidatures for you features ? ",
                },
                {
                  component: <FormResponseAI />,
                },
              ]
            : [{ component: <></>, label: "Please create mission first" }]
        }
      />
    </MyLayoutApp>
  );
};

export default PageCreateFeature;
