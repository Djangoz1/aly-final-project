import { Icon } from "@iconify/react";
import { MyCheckboxes } from "components/myComponents/form/MyCheckboxes";
import { MyFormInfo } from "components/myComponents/form/MyFormInfo";
import { MyInput } from "components/myComponents/form/MyInput";

import { MyInputsFile } from "components/myComponents/form/MyInputsFile";
import { MySelects } from "components/myComponents/form/MySelects";
import { MyTextArea } from "components/myComponents/form/MyTextArea";
import { MyToggle } from "components/myComponents/form/MyToggle";
import { useAuthState } from "context/auth";
import { icfyFB, icfyGITHUB2, icfyLINKEDIN, icfyTWITTER } from "icones";
import React from "react";
let margin = "mb-4";
// Identity
export const FormEditProfile1 = () => {
  return (
    <div className="">
      <div className={"flex " + margin}>
        <MyInput target={"username"} />
        <MyInput target={"phone"} />
      </div>

      <MyInputsFile
        styles={margin}
        inputs={[
          { label: "Photo de profil", target: "image" },
          { label: "Bannière", target: "banniere" },
        ]}
      />
      <MyTextArea label={"Bio"} target={"description"} />
    </div>
  );
};

// Social

export const FormEditProfile2 = () => {
  return (
    <div className={"flex " + margin}>
      <MyInput
        target={"facebook"}
        label={
          <span className="flex items-center">
            <Icon className="text-2xl mr-2" icon={icfyFB} /> Facebook
          </span>
        }
      />
      <MyInput
        target={"linkedin"}
        label={
          <span className="flex items-center">
            <Icon className="text-2xl mr-2" icon={icfyLINKEDIN} /> Linkedin
          </span>
        }
      />
      <MyInput
        target={"github"}
        label={
          <span className="flex items-center">
            <Icon className="text-2xl mr-2" icon={icfyGITHUB2} /> Github
          </span>
        }
      />
      <MyInput
        target={"twitter"}
        label={
          <span className="flex items-center">
            <Icon className="text-2xl mr-2" icon={icfyTWITTER} /> Twitter
          </span>
        }
      />
    </div>
  );
};

// Work
export const FormEditProfile3 = () => {
  return (
    <div className="">
      <MyFormInfo
        title={
          <MyToggle target={"visibility"} label={"Visibilité de mon profil"} />
        }
        description={
          <>
            En activant la visibilité de votre profil, votre CV sera visible par
            les recruteurs sur la plateforme. En revanche la visibilité de votre
            profil depuis la blockchain n'est elle pas modifiable
            <br />
            <br />
            Vous pourrez le modifier à tout moment.
          </>
        }
      />
      {/* <MySelects
        styles={margin}
        selects={[
          {
            target: "languages",
            target1: "langue",
            label: "Langues",
            arr: ["Français", "Espagnol", "Italien", "Allemand", "Anglais"],
            placeholder: "Quelle langue maitrisez-vous ?",
          },
        ]}
      /> */}
      <MyInputsFile
        styles={margin}
        inputs={[{ label: "CV", target: "cvImg" }]}
      />
    </div>
  );
};

// Blockchain
export const FormEditProfile4 = () => {
  return <MyInput label={"Account address"} target={"address"} />;
};
