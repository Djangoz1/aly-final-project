import React from "react";
import { MyModal } from "../MyModal";
import { Icon } from "@iconify/react";
import { icfyCV } from "icones";
import { MyCheckboxes } from "components/myComponents/myForm/MyCheckboxes";
import { ListDevDomains } from "components/inputs/inputsMission/Description/list";
import { DEV_DOMAIN } from "constants/languages";
import { ENUMS_COURTS } from "constants/enums";
import { MyInputs } from "components/myComponents/myForm/MyInputs";
import { MySelects } from "components/myComponents/myForm/MySelects";
import { MyFormInfo } from "components/myComponents/myForm/MyFormInfo";
import { MyInputsFile } from "components/myComponents/myForm/MyInputsFile";
import { useAuthState } from "context/auth";
import { CVName } from "components/inputs/inputsCV/CVName";

export const CreateMission = () => {
  let { metadatas } = useAuthState();

  return (
    <MyModal
      btn={"Create feature"}
      styles={{
        btn: "ml-5 btn btn-xs btn-primary btn-outline",
        modal: "w-[80%]",
      }}
      modal={
        <div className="flex ">
          <ul className="steps steps-vertical min-w-fit mr-12">
            <li data-content="👤" className="step step-primary">
              Information personnelle
            </li>
            <li data-content="🪪" className="step step-primary">
              Déposez votre CV
            </li>
            <li data-content="👨‍💻" className="step">
              Recherche de poste
            </li>
            <li data-content="🎓" className="step">
              Formation
            </li>
            <li data-content="🔌" className="step">
              Compétences
            </li>
            <li data-content="👁️" className="step">
              Votre visibilité
            </li>
            <li data-content="🫂" className="step">
              Réseaux social
            </li>
          </ul>
          <div className="">
            <MyFormInfo
              title={
                <h6 className="text-2xl">
                  Salut <CVName metadata={metadatas} /> ! 👋
                </h6>
              }
              description={
                <>
                  <p className="w-4/5">
                    🤖 Je suis machin, ton IA assistant.
                    <br />
                    Je te laisse renseigner les informations nécessaire à la
                    création de la mission et je reviendrais vers toi pour te
                    conseiller et t'aider.
                  </p>
                  <div className="text-error -mt-3 flex items-center ml-auto">
                    <input
                      type="checkbox"
                      className="toggle toggle-sm toggle-success mr-2"
                      checked
                    />
                    Désactiver
                  </div>
                </>
              }
            />

            <form className="flex flex-col mt-5">
              <MyInputs
                inputs={[
                  {
                    label: "Titre",
                    placeholder: "Intitulé de la mission",
                  },
                ]}
              />

              <MySelects
                styles={"my-4"}
                selects={[
                  {
                    label: "Mission Ref*",
                    arr: [
                      "Mission 1",
                      "Mission 2",
                      "Mission 3",
                      "Mission 4",
                      "Mission 5",
                      "Mission 6",
                    ],
                    placeholder: "Liaison à une ancienne mission",
                  },
                  {
                    label: "Launchpad*",
                    arr: [
                      "Launchpad 1",
                      "Launchpad 2",
                      "Launchpad 3",
                      "Launchpad 4",
                      "Launchpad 5",
                      "Launchpad 6",
                    ],
                    placeholder: "Est-elle financé par un launchpad ?",
                  },
                  {
                    label: "Domaine",
                    target: "name",
                    arr: DEV_DOMAIN,
                    placeholder: "Quel domaine concerne la mission ?",
                  },
                ]}
              />

              <div className="mb-4  flex flex-col">
                <label className="text-light font-light text-xs mb-1 uppercase ">
                  Description
                </label>
                <textarea
                  className="textarea font2 font-light textarea-bordered h-24"
                  placeholder="Write your description ..."
                ></textarea>
              </div>
              <MyInputsFile
                styles={"mb-4"}
                inputs={[{ label: "Image" }, { label: "Bannière" }]}
              />

              <MyFormInfo
                title={<>⚠️ Attention ! </>}
                description={
                  <>
                    Aucune de ces informations n'ont une incidence sur le
                    protocole. Elles ne servent qu'à un but purement
                    informative.
                  </>
                }
              />

              <button className=" my-4 ml-auto btn btn-success btn-xs">
                Créer Feature
              </button>
            </form>
          </div>
        </div>
      }
    />
  );
};
