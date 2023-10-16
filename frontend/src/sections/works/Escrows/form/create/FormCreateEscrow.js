import { MyInput } from "components/myComponents/form/MyInput";
import { MyInputsFile } from "components/myComponents/form/MyInputsFile";
import { MySelects } from "components/myComponents/form/MySelects";
import { MyTextArea } from "components/myComponents/form/MyTextArea";
import { DEV_DOMAIN } from "constants/languages";
import { useAuthState } from "context/auth";
import { useToolsState } from "context/tools";
import React from "react";

let margin = "mb-4";
export const FormCreateEscrow1 = () => {
  const { cv } = useAuthState();

  let { state } = useToolsState();

  return (
    <div>
      <div className="flex items-center mb-4">
        <MyInput
          min={3}
          styles={"mr-4"}
          type={"number"}
          target={"arbitrators"}
        />
        <MyInput min={1} styles={"mr-4"} type={"number"} target={"appeal"} />
      </div>
      <MySelects
        styles={margin}
        selects={[
          {
            label: "feature",
            target: "feature",
            target1: "title",
            arr: state?.arr,
          },
          {
            label: "court",
            target: "court",
            arr: ["Centralized", "Kleros"],
          },
        ]}
      />
      <MyInputsFile styles={margin} inputs={[{ target: "image" }]} />

      <MyTextArea
        styles={margin + " min-h-[30vh]"}
        label={"description"}
        target={"description"}
      />
    </div>
  );
};
