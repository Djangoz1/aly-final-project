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
let margin = "mb-4";
export const FormCreateFeature1 = () => {
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
        styles={margin}
        inputs={[{ label: "Image", target: "image" }]}
      />
      <MyTextArea
        styles={"min-h-[25vh] "}
        target={"description"}
        label={"Description"}
        placeholder={"Write your description"}
      />
    </div>
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

      <MyFormInfo
        title={
          <>
            <div className="text-white text-sm  flex items-center ">
              <MyToggle
                target={"onlyInvite"}
                label={"Seulement sur invitation"}
              />
            </div>
          </>
        }
        description={
          <>
            <br />
            <span className="text-white ">⚠️ Attention !</span>
            <p>
              <br />
              Souhaitez vous ouvrir les postulations pour ce poste
              <br />
              <br />
              <span className="text-white ">Si vous acceptez, </span>
              vous serez en capacité d'ouvrir ce poste à la candidature et vous
              pourez ensuite signé celui que vous souhaiterez.
              <br />
              <span className="text-white ">Si vous refusez, </span>
              vous ne pourrais pas recevoir les candidatures et vous devrez
              d'abord proposer ce poste à un freelancer qui choisiras d'accepter
              ou non .
              <br />
              <br />
              Veuillez choisir correctement la
              <span className="text-white "> spécification </span>
              car celle-ci seras déterminante en cas de
              <span className="text-white "> litiges</span>.
              <br />
              <br />
              En cas de litige, le protocole enverras le dossier directement à
              la
              <span className="text-white "> court lié à la spécification</span>
              .
              <br />
              La court est composé de jurys qui ont de l'expérience sur cette
              spécification.
            </p>
          </>
        }
      />
    </div>
  );
};
