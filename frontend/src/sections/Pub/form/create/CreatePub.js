import React from "react";

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

let moock = {
  description: null,
  image: null,
  tags: null,
};

export const CreatePub = ({ answerID, missionID, styles, btn }) => {
  const { cv, metadatas } = useAuthState();
  let { address, isConnected } = useAccount();
  let { cvID } = useCVState();
  let dispatchMission = useMissionDispatch();
  let dispatchCV = useCVDispatch();
  let dispatchAuth = useAuthDispatch();
  let submitForm = async (form) => {
    if (isConnected) {
      let uri = await createURIPub(form);
      if (answerID > 0) {
        await _apiPost("createPubAnswer", [answerID, uri]);
      } else if (missionID > 0) {
        await _apiPost("createPubMission", [missionID, uri]);
        await doStateMission(dispatchMission, missionID);
      } else {
        await _apiPost("createPub", [uri]);
      }

      await doAuthCV(dispatchAuth, address);
      if (cvID > 0) {
        await doStateCV(dispatchCV, cvID);
      }
    }
  };

  moock.missionID = missionID || null;
  moock.answerID = parseInt(answerID) || null;
  moock.reference = answerID ? 2 : missionID ? 1 : 0;

  return (
    isConnected && (
      <MyFormModal
        submit={submitForm}
        stateInit={{
          form: moock,
          checked: [["description"]],
          placeholders: {
            description: "Hey ! What's new ?",
            reference: "For who ?",
          },
        }}
        btn={btn}
        styles={{
          btn: styles,
          modal: "w-fit",
        }}
        editer={
          <>
            <Icon icon={icfySEND} className="text-2xl mr-2 my-2 " />
            <span className="flex  items-center text-white">Send</span>
          </>
        }
        components={[
          <div className="">
            <ProfileAvatar
              cvID={cv}
              metadatas={metadatas}
              component={
                <MySelects
                  selects={[
                    {
                      target: "reference",
                      placeholder: "Reference",
                      arr: ["Public", "Mission", "Answer"],
                    },
                  ]}
                />
              }
            />
            <form className="flex flex-col mt-5">
              <MyTextArea target={"description"} styles={"min-h-[30vh] mb-5"} />
              <div className="flex justify-between items-end">
                <MyInputsFile inputs={[{ label: "Image", target: "image" }]} />
              </div>
            </form>
          </div>,
        ]}
      />
    )
  );
};
