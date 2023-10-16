import React, { useState } from "react";

import { MySelects } from "components/myComponents/form/MySelects";

import { doAuthCV, useAuthDispatch, useAuthState } from "context/auth";
import { MyFormModal } from "components/myComponents/form/MyFormModal";
import { Icon } from "@iconify/react";
import { icfy, icfySEND } from "icones";
import { MyTextArea } from "components/myComponents/form/MyTextArea";
import { _apiGet, _apiPost } from "utils/ui-tools/web3-tools";
import { createURIPub } from "utils/ui-tools/pinata-tools";
import { useAccount } from "wagmi";
import { CodeEditor } from "components/myComponents/MyEditor";
import {
  doStateProfileTools,
  useToolsDispatch,
  useToolsState,
} from "context/tools";
import { MyMenusTabs } from "components/myComponents/menu/MyMenus";
import { moock_create_post } from "constants/moock";
import { ENUMS } from "constants/enums";
import { doInitStateForm } from "context/form";
import { MyInput } from "components/myComponents/form/MyInput";

export const CreatePub = ({ answerID, missionID, style, btn }) => {
  const { cv, metadatas } = useAuthState();
  let moock = moock_create_post;
  let [isClicked, setIsClicked] = useState(0);
  let { address, isConnected } = useAccount();
  let { state } = useToolsState();
  let dispatch = useAuthDispatch();
  let dispatchTools = useToolsDispatch();
  let inputs = [
    <MyTextArea label={<></>} styles={"min-h-[30vh]"} target={"description"} />,
    <CodeEditor style={"min-h-[55vh]"} isForm={true} target={"description"} />,
  ];

  let types = ["Post", "Code"];

  // let dispatchMission = useMissionDispatch();

  let dispatchAuth = useAuthDispatch();
  let submitForm = async (form) => {
    if (isConnected) {
      console.log("form", form);

      if (isClicked === 1) {
        form.code = true;
      } else {
        form.code = false;
      }
      form.owner = metadatas;

      let uri = await createURIPub(form);
      console.log(uri);

      if (answerID > 0) {
        await _apiPost("createPubAnswer", [answerID, uri]);
      } else if (missionID > 0) {
        await _apiPost("createPubMission", [missionID, uri]);
      } else {
        await _apiPost("createPub", [uri]);
      }

      await doAuthCV(dispatchAuth, address);
      await doStateProfileTools({ dispatch: dispatchTools, cvID: cv });
    }
  };

  moock.missionID = missionID || null;
  moock.answerID = parseInt(answerID) || null;
  moock.reference = answerID ? 2 : missionID ? 1 : 0;

  return (
    isConnected && (
      <MyFormModal
        submit={submitForm}
        btns={{
          btn: btn,
          submit: (
            <>
              <Icon icon={icfySEND} className="text-2xl  " />
              <span className="flex  items-center text-white">Send</span>
            </>
          ),
        }}
        title={
          <span className={"flex"}>
            <Icon icon={icfy.msg.chat} className="c2 mr-4" /> Blabla
          </span>
        }
        stateInit={{
          form: moock,
          checked: [["description"]],
          placeholders: {
            title: "About ...",
            description: "Hey ! What's new ?",
            reference: "For who ?",
            language: "Wich technology ?",
          },
        }}
        styles={{
          btn: style,
          modal: "w-fit",
        }}
      >
        <div className="">
          <div className="w-full ">
            <>
              <MySelects
                styles={"my-2"}
                selects={[
                  {
                    label: "Language",
                    target: "language",
                    arr: ["Javascript", "Python", "C++"],
                  },
                  {
                    label: "reference",
                    target: "reference",
                    placeholder: "Reference",
                    arr: ["Public", "Mission", "Answer"],
                  },
                ]}
                arr={types}
                value={isClicked}
                setter={setIsClicked}
              />
            </>

            <MyMenusTabs arr={types} value={isClicked} setter={setIsClicked} />
            {inputs?.[isClicked]}
          </div>
        </div>
      </MyFormModal>
    )
  );
};
