import { MyInput } from "components/myComponents/form/MyInput";
import { MyInputsFile } from "components/myComponents/form/MyInputsFile";
import { MySelects } from "components/myComponents/form/MySelects";
import { MyTextArea } from "components/myComponents/form/MyTextArea";
import { DEV_DOMAIN } from "constants/languages";
import React from "react";

let margin = "mb-4";
export const FormCreateMission1 = () => {
  return (
    <div>
      <MyInput styles={margin} target={"title"} />
      <MySelects
        styles={margin}
        selects={[
          {
            label: "Domaine",
            target: "domain",
            target1: "name",
            arr: DEV_DOMAIN,
          },
        ]}
      />
      <MyInputsFile
        styles={margin + " mr-5"}
        inputs={[
          { label: "Image", target: "image" },
          { label: "Bannière", target: "banniere" },
        ]}
      />

      <MyTextArea
        styles={margin}
        label={"description"}
        target={"description"}
      />
    </div>
  );
};

export const FormCreateMission2 = () => {
  return (
    <div className="">
      <MySelects
        selects={[
          {
            label: "Mission Ref",
            target: "reference",
            arr: [
              "Mission 1",
              "Mission 2",
              "Mission 3",
              "Mission 4",
              "Mission 5",
              "Mission 6",
            ],
          },
          {
            label: "Launchpad",
            arr: [
              "Launchpad 1",
              "Launchpad 2",
              "Launchpad 3",
              "Launchpad 4",
              "Launchpad 5",
              "Launchpad 6",
            ],
            target: "launchpad",
          },
        ]}
      />
    </div>
  );
};
