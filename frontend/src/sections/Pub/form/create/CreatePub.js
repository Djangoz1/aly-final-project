import React, { useState } from "react";

import { MySelects } from "components/myComponents/form/MySelects";

import { doAuthCV, useAuthDispatch, useAuthState } from "context/auth";
import { MyFormModal } from "components/myComponents/form/MyFormModal";
import { Icon } from "@iconify/react";
import { icfy, icfyETHER, icfyINFO, icfySEND } from "icones";
import { MyTextArea } from "components/myComponents/form/MyTextArea";
import { _apiGet, _apiPost } from "utils/ui-tools/web3-tools";
import { clientPocket, createURIPub } from "utils/ui-tools/pinata-tools";
import { useAccount } from "wagmi";
import { CodeEditor } from "components/myComponents/MyEditor";
import {
  doStateProfileTools,
  doStateTools,
  useToolsDispatch,
  useToolsState,
} from "context/tools";
import { MyMenusTabs } from "components/myComponents/menu/MyMenus";
import { moock_create_post } from "constants/moock";
import { ENUMS } from "constants/enums";
import { doInitStateForm } from "context/form";
import { MyInput } from "components/myComponents/form/MyInput";
import { MyForm } from "components/myComponents/form/MyForm";
import { LayoutForm } from "sections/Form/LayoutForm";
import { MyMainBtn } from "components/myComponents/btn/MyMainBtn";
import { MyInputFile } from "components/myComponents/form/MyInputsFile";
import { ethers } from "ethers";
import { controllers } from "utils/controllers";

export const CreatePub = ({ answerID, refresh, mission, style, btn }) => {
  const { cv, metadatas } = useAuthState();
  let moock = moock_create_post;

  let [isClicked, setIsClicked] = useState(0);
  let { address, isConnected } = useAccount();
  let { state, pointer } = useToolsState();
  let dispatch = useAuthDispatch();
  let dispatchTools = useToolsDispatch();
  let inputs = [
    <MyTextArea
      label={{ no: true }}
      styles={"min-h-[30vh] w-full"}
      target={"description"}
    />,
    <CodeEditor
      style={" max-h-[30vh] mb-[40vh]"}
      isForm={true}
      target={"description"}
    />,
  ];

  let types = ["Post", "Code"];

  // let dispatchMission = useMissionDispatch();

  let dispatchAuth = useAuthDispatch();
  let submitForm = async (form) => {
    if (!isConnected && !form?.description) {
      throw new Error("Error create post: Missing value");
    }

    if (isConnected) {
      console.log("form", form);

      form = { ...form, code: false };

      if (isClicked === 1) {
        form.code = true;
      }
      if (state?.form?.payable) {
        form.payable = true;
      }

      form.owner = metadatas;
      form.answerID = answerID;
      form.mission = mission;
      console.log("ezgkljzgkzgj", form);
      let result = await controllers.create.pub(form);
      console.log("result", result);

      if (refresh) {
        refresh();
      }
      return;
      // let { uri, uriPayable } = await createURIPub(form);
      // if (uriPayable) {
      //   await _apiPost("createPayablePub", [
      //     uri,
      //     ethers.utils.parseEther(form?.amount)?._hex,
      //     uriPayable,
      //   ]);
      // } else if (answerID > 0) {
      //   await _apiPost("createPubAnswer", [answerID, uri]);
      // } else if (missionID > 0) {
      //   await _apiPost("createPubMission", [missionID, uri]);
      // } else {
      // }

      await doAuthCV(dispatchAuth, address);
      if (refresh) {
        await refresh();
      } else {
        await doStateProfileTools({ dispatch: dispatchTools, cvID: cv });
      }
    }
  };

  return (
    // isConnected && (
    true && (
      <LayoutForm
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
          allowed: true,
          form: moock,
          checked: [["description"]],
          placeholders: {
            title: "About ...",
            description: "Hey ! What's new ?",
            reference: "For who ?",
            language: "Wich technology ?",
            amount: "Price of pub",
          },
        }}
        styles={{
          modal: "w-fit",
        }}
      >
        <div className={`w-full  h-full p-10 ${style}`}>
          <div className="flex mb-5 w-full  ">
            <MyMenusTabs
              style={" ml-auto flex-row "}
              template={2}
              // styleOrigin={
              //   // "bg-black rounded-full overflow-hidden text-white py-3"
              // }
              color={"no"}
              arr={types}
              value={isClicked}
              setter={setIsClicked}
            />

            <MyMainBtn
              template={state?.form?.payable ? 2 : 1}
              color={1}
              padding={!state?.form?.payable ? "btn-xs px-2 py-2" : "px-2 py-2"}
              url={"#section1"}
              setter={() =>
                doStateTools(
                  dispatchTools,
                  {
                    ...state,
                    form: { ...state?.form, payable: !state?.form?.payable },
                  },
                  pointer
                )
              }
              style={" rounded-full text-[10px] "}
              icon={{ no: true }}
            >
              {state?.form?.payable ? "Payable pub" : "Free pub"}
            </MyMainBtn>
          </div>
          {state?.form?.payable && (
            <MyInput icon={icfyINFO} styles={"mb-5"} target={"title"}></MyInput>
          )}
          <div className="flex w-full  ">
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
            />
          </div>
          <div className="flex items-center my-5 ">
            <MyInputFile
              style={"justify-end mr-5  "}
              target={state?.form?.payable ? "preview" : "image"}
            ></MyInputFile>
            {state?.form?.payable && (
              <>
                <MyInputFile
                  style={"justify-end mr-5  "}
                  target={"file"}
                ></MyInputFile>
                <MyInput type={"number"} icon={icfyETHER} target={"amount"} />
              </>
            )}
          </div>
          <div className=" relative w-full ">
            {inputs?.[isClicked]}
            <MyMainBtn
              form={true}
              template={1}
              color={1}
              style={"mt-8 btn-sm absolute bottom-0 right-0 "}
              setter={submitForm}
              url={"#section1"}
            >
              Post
            </MyMainBtn>
          </div>
        </div>
      </LayoutForm>
    )
  );
};
