import { MyCheckboxes } from "components/myComponents/form/MyCheckboxes";
import { MyFormInfo } from "components/myComponents/form/MyFormInfo";
import { MyInput } from "components/myComponents/form/MyInput";

import {
  MyInputFile,
  MyInputsFile,
} from "components/myComponents/form/MyInputsFile";
import { MySelect, MySelects } from "components/myComponents/form/MySelects";
import { MyTextArea } from "components/myComponents/form/MyTextArea";
import { MyToggle } from "components/myComponents/form/MyToggle";
import { MySub } from "components/myComponents/text/MySub";
import { ENUMS } from "constants/enums";
import { DEV_DOMAIN } from "constants/languages";
import { ADDRESSES } from "constants/web3";
import { useAuthState } from "context/auth";
import { doStateTools, useToolsDispatch, useToolsState } from "context/tools";
import React, { useEffect, useState } from "react";
import { _apiGet } from "utils/ui-tools/web3-tools";
import { fetchMissionsOfCV } from "utils/works";
let margin = "my-10";
export const FormCreateFeature1 = () => {
  return (
    <>
      <div className={"flex w-full " + margin}>
        <MySub style={"min-w-[20%] c4"}>Informations</MySub>
        <div className="flex w-full gap-5">
          <MyInput styles={"w-full"} target={"title"} />
          <MyInputFile target={"image"} />
        </div>
      </div>
      <div className={"flex w-full " + margin}>
        <MySub style={"min-w-[20%] c4"}>Domain</MySub>

        <MySelect
          label={false}
          target={"domain"}
          arr={ENUMS.domain.map((el) => el.name)}
        />
      </div>
      <div className={"flex w-full " + margin}>
        <MySub style={" min-w-[20%] c4"}>Description</MySub>
        <div className="flex flex-col gap-4 w-full">
          <MyTextArea
            styles={"min-h-[10vh] max-h-[20vh]  "}
            target={"abstract"}
            label={"Resume"}
          />
          <MyTextArea
            styles={"min-h-[25vh] max-h-fit  "}
            target={"description"}
            // label={false}
          />
        </div>
      </div>
    </>
  );
};

export const FormCreateFeature2 = () => {
  let { cv } = useAuthState();
  let [isMissions, setIsMissions] = useState(null);
  const { state } = useToolsState();
  const dispatch = useToolsDispatch();
  console.log("state", state);
  let fetchMissions = async () => {
    let missions = await fetchMissionsOfCV(cv, true);
    let arr = [];

    for (let index = 0; index < missions.length; index++) {
      const mission = missions[index];
      arr.push({ title: mission.metadatas.title, id: mission?.datas?.id });
    }
    doStateTools(dispatch, { ...state, missions: arr });
  };
  useEffect(() => {
    if (cv > 0 && !state?.missions) {
      fetchMissions();
    }
  }, [cv]);

  return (
    <div className="w-full flex flex-col">
      <div className={`flex w-full ${margin}`}>
        <MySub style={"c4 w-[20%]"}>Protocoles</MySub>
        <div className="flex w-full gap-5">
          <MySelect
            label="Mission"
            target="missionID"
            arr={state?.missions?.map((el) => el?.title)}
          />
          <MySelect
            arr={ENUMS.courts.map((el) => el.court)}
            target="specification"
          />
        </div>
      </div>
      <div className={"flex  w-full " + margin}>
        <MySub style={"w-[20%] c4"}>Freelancer</MySub>
        <div className="flex w-full gap-5">
          <MyInput target={"wadge"} styles={"mr-3"} type={"number"} />
          <MyInput target={"worker"} styles={"mr-3"} type={"number"} />
          <MyInput
            styles={"mr-3"}
            target={"estimatedDays"}
            label={"Temps estimé"}
            type={"number"}
          />
        </div>
      </div>
      <div className={"flex  w-full " + margin}>
        <MySub style={"w-[20%] c4"}>Experience</MySub>
        <div className="flex w-full gap-5">
          <MyCheckboxes
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
      </div>
    </div>
  );
};
