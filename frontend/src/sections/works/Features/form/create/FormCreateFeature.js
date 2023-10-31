import { MyCheckboxes } from "components/myComponents/form/MyCheckboxes";
import { MyFormInfo } from "components/myComponents/form/MyFormInfo";
import { MyInput } from "components/myComponents/form/MyInput";

import { MyInputsFile } from "components/myComponents/form/MyInputsFile";
import { MySelects } from "components/myComponents/form/MySelects";
import { MyTextArea } from "components/myComponents/form/MyTextArea";
import { MyToggle } from "components/myComponents/form/MyToggle";
import { ENUMS } from "constants/enums";
import { DEV_DOMAIN } from "constants/languages";
import { ADDRESSES } from "constants/web3";
import { useAuthState } from "context/auth";
import React, { useEffect, useState } from "react";
import { _apiGet } from "utils/ui-tools/web3-tools";
import { fetchMissionsOfCV } from "utils/works";
let margin = "mb-8";
export const FormCreateFeature1 = () => {
  return (
    <>
      <MyInput styles={margin} target={"title"} />
      <div className={"flex items-center " + margin}>
        <MySelects
          styles={"mr-5 w-fit"}
          selects={[
            {
              label: "Domaine",
              target: "domain",
              target1: "name",
              arr: DEV_DOMAIN,
            },
          ]}
        />
        <MyInputsFile inputs={[{ label: "Image", target: "image" }]} />
      </div>
      <MyTextArea
        styles={"min-h-[25vh] max-h-fit  "}
        target={"description"}
        label={"Description"}
        placeholder={"Write your description"}
      />
    </>
  );
};

export const FormCreateFeature2 = () => {
  let { cv } = useAuthState();
  let [isMissions, setIsMissions] = useState(null);

  let fetchMissions = async () => {
    let missions = await fetchMissionsOfCV(cv, true);
    let arr = [];
    for (let index = 0; index < missions.length; index++) {
      const mission = missions[index];
      arr.push(mission.metadatas.title);
    }
    setIsMissions(arr);
  };
  useEffect(() => {
    if (cv > 0 && !isMissions) {
      fetchMissions();
    }
  }, [cv]);

  return (
    <div className="">
      <MySelects
        styles={margin}
        selects={[
          {
            label: "Mission",
            target: "missionID",
            arr: isMissions,
          },
          {
            label: "Specification",
            target: "specification",
            target1: "court",
            arr: ENUMS.courts,
          },
        ]}
      />
      <div className={"flex " + margin}>
        <MyInput target={"wadge"} styles={"mr-3"} type={"number"} />
        <MyInput target={"worker"} styles={"mr-3"} type={"number"} />
        <MyInput
          styles={"mr-3"}
          target={"estimatedDays"}
          label={"Temps estimé"}
          type={"number"}
        />
      </div>

      <MyCheckboxes
        styles={margin}
        label={
          "Autorisez vous un freelancer à signer directement selon l'expérience ?"
        }
        target={"experience"}
        checkboxes={[
          { title: "Non" },
          { title: "plus d'1 " },
          { title: "plus de 5 " },
          { title: "plus de 10 " },
          { title: "plus de 3 " },
        ]}
      />
    </div>
  );
};
