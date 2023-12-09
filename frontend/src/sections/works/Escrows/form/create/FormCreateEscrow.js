import { MyCardInfos } from "components/myComponents/card/MyCard";
import { MyInput } from "components/myComponents/form/MyInput";
import { MyInputsFile } from "components/myComponents/form/MyInputsFile";
import { MySelect, MySelects } from "components/myComponents/form/MySelects";
import { MyTextArea } from "components/myComponents/form/MyTextArea";
import { MySub } from "components/myComponents/text/MySub";
import { DEV_DOMAIN } from "constants/languages";
import { useAuthState } from "context/auth";
import { useToolsState } from "context/tools";
import React from "react";

let margin = "mb-4";
export const FormCreateEscrow1 = () => {
  const { cv } = useAuthState();

  let { state } = useToolsState();

  return (
    <div className="flex flex-col gap-5">
      <div className="flex   w-full">
        <MySub style={"w-[25%] c4"}>Escrow details</MySub>
        <div className="flex items-center gap-5">
          <MyInput
            min={3}
            styles={"mr-4"}
            type={"number"}
            target={"arbitrators"}
          />
          <MyInput min={1} styles={"mr-4"} type={"number"} target={"appeal"} />
        </div>
      </div>
      <div className="flex   w-full">
        <MySub style={"w-[25%] c4"}>Work protocole</MySub>
        <div className="flex gap-4">
          <MySelect
            styles={margin}
            target="feature"
            arr={state?.arr?.map((el) => el?.title)}
          />
          <MySelect
            styles={margin}
            target="court"
            arr={["Centralized", "Kleros", "Decentralized"]}
          />
        </div>
      </div>
      <div className="flex   w-full">
        <MySub style={"min-w-[25%] c4"}>Proofs</MySub>
        <div className="flex flex-col w-full gap-4">
          <MyInputsFile styles={margin} inputs={[{ target: "image" }]} />
          <MyTextArea
            styles={"w-full min-h-[30vh]"}
            label={false}
            target={"description"}
          />
        </div>
      </div>
    </div>
  );
};
