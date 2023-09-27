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
import { createURIPub } from "utils/ui-tools/pinata-tools";
import { doStateCV, useCVDispatch, useCVState } from "context/hub/cv";
import { doStateMission, useMissionDispatch } from "context/hub/mission";
import { useAccount } from "wagmi";
import { ADDRESSES } from "constants/web3";
import { fetchMissionsOfCV } from "utils/works";
import { stateFeature } from "utils/ui-tools/state-tools";
import { useFormState } from "context/form";
import { MyFormInfo } from "components/myComponents/form/MyFormInfo";

let moock = {
  description: null,
  image: null,
  tags: null,
};

export const EditWorker = ({ answerID, missionID, styles }) => {
  const { cv } = useAuthState();
  let { address, isConnected } = useAccount();
  let { cvID, datas, metadatas } = useCVState();

  let dispatchCV = useCVDispatch();
  let dispatchAuth = useAuthDispatch();
  let [isFeatures, setIsFeatures] = useState(null);

  let submitForm = async (form) => {
    let featureID = isFeatures[parseInt(form.featureID)].id;
    if (featureID > 0 && cvID > 0) {
      await _apiPost("inviteWorker", [parseInt(cvID), featureID]);
      doStateCV(dispatchCV, cvID);
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
        console.log(feature);
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
    //   if (cv && !isMissions && datas.missions > 0)
  }, [cv]);

  return (
    isConnected && (
      <MyFormModal
        submit={submitForm}
        stateInit={{
          form: {
            featureID: null,
          },
          checked: [["featureID"]],
          placeholders: {
            featureID: "For wich mission ?",
          },
        }}
        btn={"Invite worker"}
        styles={{
          btn: styles,
          modal: "w-2/4",
        }}
        editer={
          <>
            <Icon icon={icfySEND} className="text-2xl mr-2 my-2 " />
            <span className="flex  items-center text-white">Invite worker</span>
          </>
        }
        components={[
          <div className="">
            <FormWorker features={isFeatures} />
          </div>,
        ]}
      />
    )
  );
};

let FormWorker = ({ features }) => {
  let { cvID, metadatas } = useCVState();
  let [isFeature, setIsFeature] = useState(null);

  return (
    <MyFormInfo
      title={
        <>
          <Icon icon={icfy.work.casual} className="mr-2 text-2xl text-info" />
          Invite worker
        </>
      }
      description={
        <>
          <div>
            <p className="text-white flex items-center text-sm">
              <Icon
                icon={icfy.ux.warning}
                className="text-warning text-xl mr-2"
              />{" "}
              Attention !
            </p>
            <br />
            Ceci est une invitation et le worker doit accepté pour pouvoir
            démarrer le travail. Le compteur claimable commenceras une fois que
            le worker a accepté l'invitation
          </div>
          <p className="mt-4">
            Vous voulez invitez{" "}
            <span className="text-white">{metadatas?.username}</span> pour :
            <span className="text-white ml-2">
              #{isFeature?.id} {isFeature?.title || "en attente"}
            </span>
          </p>
          <MySelects
            selects={[
              {
                setter: setIsFeature,
                target: "featureID",
                arr: features,
                value: "id",
                target1: "title",
              },
            ]}
          />
        </>
      }
    />
  );
};
