import React, { useEffect, useState } from "react";

import { MySelects } from "components/myComponents/form/MySelects";

import { ProfileAvatar } from "components/profile/ProfileAvatar";
import { MyInputsFile } from "components/myComponents/form/MyInputsFile";
import { doAuthCV, useAuthDispatch, useAuthState } from "context/auth";
import { MyFormModal } from "components/myComponents/form/MyFormModal";
import { Icon } from "@iconify/react";
import { icfy, icfySEND } from "icones";
import { MyTextArea } from "components/myComponents/form/MyTextArea";
import { _apiGet, _apiPost } from "utils/ui-tools/web3-tools";
import { useAccount } from "wagmi";
import { ADDRESSES } from "constants/web3";
import { fetchMissionsOfCV } from "utils/works";
import { stateFeature } from "utils/ui-tools/state-tools";
import { useFormState } from "context/form";
import { MyFormInfo } from "components/myComponents/form/MyFormInfo";
import {
  doStateProfileTools,
  useToolsDispatch,
  useToolsState,
} from "context/tools";

let moock = {
  description: null,
  image: null,
  tags: null,
};

export const EditWorker = ({ styles }) => {
  const { cv } = useAuthState();
  let { address, isConnected } = useAccount();

  let { state } = useToolsState();
  console.log(state);
  let dispatch = useToolsDispatch();

  let dispatchAuth = useAuthDispatch();
  let [isFeatures, setIsFeatures] = useState(null);

  let submitForm = async (form) => {
    let featureID = isFeatures[parseInt(form.featureID)].id;
    if (featureID > 0 && state?.owner?.cvID > 0) {
      await _apiPost("inviteWorker", [parseInt(state?.owner?.cvID), featureID]);
      doStateProfileTools({ dispatch, cvID: state?.owner?.cvID });
      doAuthCV(dispatchAuth, address);
    }
  };
  let fetchFeatures = async () => {
    let arr = [];
    let missions = await fetchMissionsOfCV(cv, true);

    for (let index = 0; index < missions?.length; index++) {
      const mission = missions[index];
      for (let index = 0; index < mission?.datas?.features?.length; index++) {
        const featureID = mission?.datas?.features[index];
        let feature = await stateFeature(featureID);

        if (parseInt(feature.details.signedWorker) === 0) {
          arr.push({
            title: feature?.metadatas?.title,
            id: parseInt(feature?.featureID),
          });
        }
      }
    }
    setIsFeatures(arr);
  };

  useEffect(() => {
    fetchFeatures();
  }, [cv]);

  return (
    isConnected && (
      <MyFormModal
        submit={submitForm}
        stateInit={{
          form: {
            target: "Worker",
            featureID: null,
          },
          checked: [["featureID"]],
          placeholders: {
            featureID: "For wich mission ?",
          },
        }}
        btns={{
          btn: "Invite worker",
          submit: (
            <>
              <Icon icon={icfySEND} className="text-2xl mr-2 my-2 " />
              <span className="flex  items-center text-white">
                Invite worker
              </span>
            </>
          ),
        }}
        styles={{
          btn: styles,
          modal: "w-fit",
        }}
      ></MyFormModal>
    )
  );
};
