import { Icon } from "@iconify/react";
import { MyCheckboxes } from "components/myComponents/form/MyCheckboxes";
import { MyFormInfo } from "components/myComponents/form/MyFormInfo";
import { MyInput } from "components/myComponents/form/MyInput";

import { MyInputsFile } from "components/myComponents/form/MyInputsFile";
import { MySelects } from "components/myComponents/form/MySelects";
import { MyTextArea } from "components/myComponents/form/MyTextArea";
import { MyToggle } from "components/myComponents/form/MyToggle";
import { ENUMS } from "constants/enums";
import { DEV_DOMAIN } from "constants/languages";
import {
  doInitStateForm,
  doStateFormChecked,
  doStateFormDisabled,
  useFormDispatch,
  useFormState,
} from "context/form";
import { useInView } from "framer-motion";
import {
  icfy,
  icfyFB,
  icfyGITHUB2,
  icfyLINKEDIN,
  icfyMAIL,
  icfyTWITTER,
} from "icones";
import React, { useEffect, useRef } from "react";

let margin = "my-4";
export const FormCreateProfile1 = () => {
  let dispatch = useFormDispatch();

  let ref = useRef(null);
  let isInView = useInView(ref);
  // useEffect(() => {
  //   if (isInView) {
  //     doStateFormDisabled(dispatch, true);
  //   }
  // }, [isInView]);

  return (
    <div className="w-full  flex flex-col " ref={ref}>
      <MyCheckboxes
        label={"Civilité"}
        target={"citizen"}
        checkboxes={[
          { title: "M.", value: "Mr" },
          { title: "Mme.", value: "Mme" },
        ]}
      />
      <div className={"flex w-full  mt-4 " + margin}>
        <MyInput
          styles={"w-full mr-10 "}
          target={"firstName"}
          label={"Prénom"}
        />
        <MyInput styles={"w-full"} target={"lastName"} label={"Nom"} />
      </div>
      <div className={"flex w-full " + margin}>
        <MyInput target={"username"} styles={"w-full mr-10"} />
        <MyInput
          target={"email"}
          styles={"w-full"}
          icon={icfyMAIL}
          type={"mail"}
        />
      </div>
      <div className={"flex " + margin}>
        <MyInput
          target={"phone"}
          styles={"mr-10 w-full"}
          icon={icfy.ux.phone}
          type={"phone"}
        />
        <MyInput
          styles={"w-full"}
          target={"dateOfBirth"}
          label={"Date de naissance"}
          type={"date"}
        />
      </div>

      <MyInputsFile
        styles={margin}
        inputs={[{ label: "Photo de profil", target: "image" }]}
      />

      <MyTextArea target={"description"} styles={"w-full "} label={"Bio"} />
    </div>
  );
};

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
        <MyInputsFile inputs={[{ label: "CV", target: "cvImg" }]} />

        <p className="text-light c4 font-light text-xs mt-2 mb-1 ">
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
            arr: ENUMS.languagesLevel,
            placeholder: "Choisir",
          },
        ]}
      />

      <div className={"flex " + margin}>
        <MyInput icon={icfyFB} target={"facebook"} />
        <MyInput icon={icfyLINKEDIN} target={"linkedin"} />
        <MyInput icon={icfyGITHUB2} target={"github"} />
        <MyInput icon={icfyTWITTER} target={"twitter"} />
      </div>
    </div>
  );
};
