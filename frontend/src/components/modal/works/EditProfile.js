import React, { useEffect, useState } from "react";
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
import { useAuthState } from "context/auth";
import { MyInputsFile } from "components/myComponents/myForm/MyInputsFile";
import { MyMenus } from "components/myComponents/menu/MyMenus";
import { _form_edit_profile } from "utils/ux-tools/form/profile";
import { MENUS_EDIT_PROFILE } from "constants/menus";
import { v4 as uuidv4 } from "uuid";

export const EditProfile = ({ styles }) => {
  let { metadatas } = useAuthState();
  let [isMetadatas, setIsMetadatas] = useState(null);
  let handleChange = ({ object, target, value }) => {
    let newDatas = isMetadatas;
    if (target) {
      newDatas.attributes[0][target] = value;
    } else if (object) {
      newDatas[object] = value;
    }
    console.log("new", newDatas);
    setIsMetadatas(newDatas);
  };

  let form = _form_edit_profile({ metadatas: isMetadatas, handleChange });

  let [isOpen, setIsOpen] = useState(null);
  let [isElement, setIsElement] = useState(form?.[0] || null);
  useEffect(() => {
    if (!isMetadatas) setIsMetadatas(metadatas);
  }, [isMetadatas]);

  useEffect(() => {
    if (form && isOpen >= 0) {
      setIsElement(form[isOpen]);
    }
  }, [isOpen, form]);

  return (
    <MyModal
      btn={"Edit profile"}
      styles={{ modal: " w-[70vw] h-[80vh] min-w-[70vw]", btn: styles }}
      modal={
        <div className="flex ">
          <MyMenus
            setter={setIsOpen}
            styles={{
              box: "flex-col w-[20vw] bg-black/10 mr-10 h-auto",
              el: "px-5 text-left",
            }}
            menus={MENUS_EDIT_PROFILE}
          />
          {/* <ul className="steps steps-vertical min-w-fit mr-12">
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
          </ul> */}
          <div className="w-full flex flex-col h-[75vh] flex-auto">
            <MyFormInfo
              title={<h6 className="text-2xl">⚙️ Settings</h6>}
              description={isElement?.description || form?.[0]?.description}
            />

            <form className="flex flex-col items-start h-full text-left mt-5">
              {isElement?.components?.map((el) => (
                <div className="" key={uuidv4()}>
                  {el}
                </div>
              )) ||
                form?.[0]?.components?.map((el) => (
                  <div className="" key={uuidv4()}>
                    {el}
                  </div>
                ))}
              {/* <MyInputs
                inputs={[
                  {
                    label: "Username",
                    placeholder: isMetadatas?.username,
                  },
                  {
                    label: "Téléphone",
                    placeholder: isMetadatas?.attributes[0]?.identity?.phone,
                  },
                ]}
                styles={"mb-1"}
              />
              <MyInputsFile
                styles={"my-2"}
                inputs={[{ label: "Photo de profil" }, { label: "Bannière" }]}
              />
              <MyInputsFile inputs={[{ label: "CV" }]} />

              <MySelects
                selects={[
                  {
                    label: "Langues",
                    arr: [
                      "Français",
                      "Espagnol",
                      "Italien",
                      "Allemand",
                      "Anglais",
                    ],
                    placeholder: "Quelle langue maitrisez-vous ?",
                  },
                  {
                    label: "Niveau",
                    arr: [
                      "Notions",
                      "Courant",
                      "Professionnel",
                      "Langue maternelle",
                    ],
                    placeholder: "Choisir",
                  },
                ]}
              />

              <MyFormInfo
                title={
                  <>
                    <input
                      type="checkbox"
                      className="toggle toggle-sm toggle-primary "
                      checked={isMetadatas?.attributes[0]?.visibility}
                      onChange={() =>
                        handleChange({
                          target: "visibility",
                          value: !isMetadatas?.attributes[0]?.visibility,
                        })
                      }
                    />
                    <span className="text-xs  w-fit ml-4">
                      Visibilité de mon profil
                    </span>
                  </>
                }
                description={
                  <>
                    En activant la visibilité de votre profil, votre CV sera
                    visible par les recruteurs sur la plateforme. En revanche la
                    visibilité de votre profil depuis la blockchain n'est elle
                    pas modifiable
                    <br />
                    <br />
                    Vous pourrez le modifier à tout moment.
                  </>
                }
              />
              <MyCheckboxes
                label={"Quel type de mission recherchez-vous ?"}
                checkboxes={[
                  { title: "- d'1 semaine" },
                  { title: "- de 4 semaines" },
                  { title: "+ de 4 semaines" },
                  { title: "+ de 3 mois" },
                  { title: "Ouvert" },
                ]}
              />

              <MySelects
                selects={[
                  {
                    label: "Métiers recherchés",
                    target: "name",
                    arr: DEV_DOMAIN,
                    placeholder: "Quel domaine recherchez vous ?",
                  },
                  {
                    label: "Compétences",
                    target: "court",
                    arr: ENUMS_COURTS,
                    placeholder: "Quelles technologies maitrisez-vous ?",
                  },
                ]}
                styles={"my-4"}
              />

              <MyInputs
                inputs={[
                  {
                    label: "Facebook",
                    placeholder: "URL https://facebook...",
                  },
                  {
                    label: "Linkedin",
                    placeholder: "URL https://linkedin...",
                  },
                  {
                    label: "Github",
                    placeholder: "URL https://github...",
                  },
                  {
                    label: "Twitter",
                    placeholder: "URL https://twitter...",
                  },
                ]}
                styles={"my-4"}
              /> */}
              <button className=" mt-auto ml-auto btn btn-success btn-xs">
                Créer CV
              </button>
            </form>
          </div>
        </div>
      }
    />
  );
};
