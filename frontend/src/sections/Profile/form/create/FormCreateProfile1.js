import { Icon } from "@iconify/react";
import { MyCheckboxes } from "components/myComponents/form/MyCheckboxes";
import { MyFormInfo } from "components/myComponents/form/MyFormInfo";
import { MyInput } from "components/myComponents/form/MyInput";

import { MyInputsFile } from "components/myComponents/form/MyInputsFile";
import { MySelects } from "components/myComponents/form/MySelects";
import { MyTextArea } from "components/myComponents/form/MyTextArea";
import { ENUMS } from "constants/enums";
import { DEV_DOMAIN } from "constants/languages";
import {
  doInitStateForm,
  doStateFormChecked,
  doStateFormDisabled,
  useFormDispatch,
  useFormState,
} from "context/form";
import { icfyFB, icfyGITHUB2, icfyLINKEDIN, icfyTWITTER } from "icones";
import React, { useEffect } from "react";

let margin = "my-4";
export const FormCreateProfile1 = React.memo(() => {
  let dispatch = useFormDispatch();

  useEffect(() => {
    doStateFormDisabled(dispatch, true);
  }, []);

  return (
    <div className="w-full">
      <MyCheckboxes
        label={"Civilité"}
        target={"citizen"}
        checkboxes={[
          { title: "M.", value: "Mr" },
          { title: "Mme.", value: "Mme" },
        ]}
      />
      <div className={"flex " + margin}>
        <MyInput target={"firstName"} label={"Prénom"} />
        <MyInput target={"lastName"} label={"Nom"} />
      </div>
      <div className={"flex " + margin}>
        <MyInput target={"username"} />
        <MyInput target={"email"} type={"mail"} />
      </div>
      <div className={"flex " + margin}>
        <MyInput target={"phone"} type={"phone"} />
        <MyInput
          target={"dateOfBirth"}
          label={"Date de naissance"}
          type={"date"}
        />
      </div>

      <MyInputsFile
        styles={margin}
        inputs={[{ label: "Photo de profil", target: "image" }]}
      />

      <MyTextArea target={"description"} label={"Bio"} />
    </div>
  );
});

export const FormCreateProfile2 = () => {
  let margin = "my-4";

  let { form, pointer, checked } = useFormState();
  let dispatch = useFormDispatch();

  const handleChange = (e) => {
    let _form = form;
    // Vous pouvez ajouter d'autres actions à exécuter lorsque le focus entre ici
    _form["visibility"] = e.target.checked;
    doInitStateForm(dispatch, _form);
  };

  return (
    <div className="">
      <div className={"flex flex-col mb-4"}>
        <MyFormInfo
          title={"👁️ Visibilité"}
          description={
            <>
              En anonymisant votre profil, votre CV sera visible en CVthèque
              mais sans votre nom, prénom, numéro de téléphone et adresse
              e-mail. Pensez à bien supprimer ces données également de votre
              fichier CV. En revanche , lorsque vous postulerez, vos données
              personnelles deviendront visibles par les recruteurs.
              <br />
              <br />
              Vous pourrez le modifier à tout moment.
              <div className="flex items-center mt-4 text-white">
                <input
                  type="checkbox"
                  className="toggle toggle-sm toggle-primary "
                  onChange={handleChange}
                  checked={form["visibility"]}
                />
                <span className="text-xs  w-fit ml-4">
                  Anonymiser mon profil
                </span>
              </div>
            </>
          }
        />

        <MyInputsFile inputs={[{ label: "CV", target: "cvImg" }]} />

        <p className="text-light text-white font-light text-xs mb-1 ">
          Vous pouvez renseigner votre CV hors plateforme afin qu'il soit vu par
          les recruteurs.
        </p>
      </div>
      <MyCheckboxes
        target={"experience"}
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
        styles={margin}
        selects={[
          {
            label: "Métiers recherchés",
            target: "domain",
            target1: "name",
            arr: DEV_DOMAIN,
            placeholder: "Quel domaine recherchez vous ?",
          },
          {
            label: "Compétences",
            target: "skills",
            target1: "court",
            arr: ENUMS.courts,
            placeholder: "Quelles technologies maitrisez-vous ?",
          },
        ]}
      />
      <MySelects
        selects={[
          {
            target: "languages",
            label: "Langues",
            arr: ["Français", "Espagnol", "Italien", "Allemand", "Anglais"],
            placeholder: "Quelle langue maitrisez-vous ?",
          },
          {
            target: "domain",
            label: "Niveau",
            arr: ["Notions", "Courant", "Professionnel", "Langue maternelle"],
            placeholder: "Choisir",
          },
        ]}
      />

      <div className={"flex " + margin}>
        <MyInput
          label={
            <span className="flex items-center">
              <Icon className="text-2xl mr-2" icon={icfyFB} /> Facebook
            </span>
          }
          target={"facebook"}
        />
        <MyInput
          label={
            <span className="flex items-center">
              <Icon className="text-2xl mr-2" icon={icfyLINKEDIN} /> Linkedin
            </span>
          }
          target={"linkedin"}
        />
        <MyInput
          label={
            <span className="flex items-center">
              <Icon className="text-2xl mr-2" icon={icfyGITHUB2} /> Github
            </span>
          }
          target={"github"}
        />
        <MyInput
          label={
            <span className="flex items-center">
              <Icon className="text-2xl mr-2" icon={icfyTWITTER} /> Twitter
            </span>
          }
          target={"twitter"}
        />
      </div>
    </div>
  );
};
