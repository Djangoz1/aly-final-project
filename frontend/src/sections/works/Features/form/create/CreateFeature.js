import React, { useEffect, useState } from "react";

import { useAuthState } from "context/auth";

import { _form_create_feature } from "utils/ux-tools/form/feature";
import { MENUS_CREATE_FEATURE } from "constants/menus";
import { MySteps } from "components/myComponents/MySteps";
import { MyFormModal } from "components/myComponents/form/MyFormModal";
import { CVName } from "components/inputs/inputsCV/CVName";
import { FormCreateFeature1, FormCreateFeature2 } from "./FormCreateFeature";
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

export const CreateFeature = () => {
  let { datas, metadatas, cv } = useAuthState();

  let { missionID, mission } = useMissionState();
  let form = _form_create_feature;
  form[0].title = (
    <>
      Salut <CVName metadata={metadatas} /> ! 👋
    </>
  );

  let dispatch = useMissionDispatch();

  let submitForm = async (form) => {
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
  return (
    <MyFormModal
      side={<MySteps arr={MENUS_CREATE_FEATURE} />}
      stateInit={{
        form: moock_create_feature,
        placeholders: moock_create_feature_placeholders,
        checked: [
          [],
          ["title", "domain", "description"],
          ["missionID", "specification", "wadge", "worker", "estimatedDays"],
        ],
      }}
      btn={"Create feature"}
      arr={datas?.missions > 0 && form}
      components={
        datas?.missions > 0
          ? ["", <FormCreateFeature1 />, <FormCreateFeature2 />]
          : [
              <MyFormInfo
                title={
                  <>
                    <Icon
                      icon={icfy.ux.warning}
                      className="text-warning mr-2 text-2xl"
                    />
                    Ooops ... Please create mission first
                  </>
                }
                description={
                  <>
                    Protocole of deWork require a mission if you wan't create a
                    feature.{" "}
                    {cv && (
                      <Link
                        className="text-info text-sm underline"
                        href={`/profile/${cv}/missions`}
                      >
                        Create mission
                      </Link>
                    )}
                  </>
                }
              />,
            ]
      }
      submit={submitForm}
    />
  );
};
