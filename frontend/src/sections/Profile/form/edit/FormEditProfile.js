import { Icon } from "@iconify/react";
import { MyCheckboxes } from "components/myComponents/form/MyCheckboxes";
import { MyFormInfo } from "components/myComponents/form/MyFormInfo";
import { MyInput } from "components/myComponents/form/MyInput";

import {
  MyInputFile,
  MyInputsFile,
} from "components/myComponents/form/MyInputsFile";
import { MySelects } from "components/myComponents/form/MySelects";
import { MyTextArea } from "components/myComponents/form/MyTextArea";
import { MyToggle } from "components/myComponents/form/MyToggle";
import { ADDRESSES } from "constants/web3";
import { doAuthCV, useAuthDispatch, useAuthState } from "context/auth";
import { doStateCV } from "context/hub/cv";
import {
  doStateProfileTools,
  useToolsDispatch,
  useToolsState,
} from "context/tools";
import {
  icfyFB,
  icfyGITHUB2,
  icfyLINKEDIN,
  icfySEND,
  icfyTWITTER,
} from "icones";
import React from "react";
import { createURI, createURICv } from "utils/ui-tools/pinata-tools";
import { _apiPost } from "utils/ui-tools/web3-tools";
import { useAccount } from "wagmi";
let margin = "mb-8";
// Identity
export const FormEditProfile1 = () => {
  const { state } = useToolsState(null);
  const { cv } = useAuthState();
  const { address } = useAccount();
  const dispatch = useToolsDispatch();
  const dispatchCV = useAuthDispatch();
  let handleChange = async (value, target, attributes) => {
    let metadatas = { ...state?.profile?.metadatas };
    console.log("value", value);
    console.log("metadatas", metadatas?.[target]);
    console.log("value", target);

    if (metadatas[target] == value || metadatas?.[target] == value) {
      throw new Error("Error: Same value");
    }

    if (
      target === "username" ||
      target === "image" ||
      target === "description"
    ) {
      metadatas[target] = value;
    } else if (target === "phone") {
      metadatas.identity[target] = value;
    } else if (target === "banniere") {
      metadatas[target] = value;
    }

    let uri = await createURI({
      id: state?.profile?.cvID,
      title: "CV",
      metadatas: metadatas,
    });
    await _apiPost("setTokenURIOf", [
      state?.profile?.cvID,
      uri,
      ADDRESSES.cvsHub,
    ]);

    await doStateProfileTools({ dispatch, cvID: state?.profile?.cvID });
    await doAuthCV(dispatchCV, address);
  };
  return (
    <div className="">
      <p className="text-xs c4 w-3/4 mb-5">
        En activant la visibilité de votre profil, votre CV sera visible par les
        recruteurs sur la plateforme. En revanche la visibilité de votre profil
        depuis la blockchain n'est elle pas modifiable
        <br />
        <br />
        Cliquez sur le status en haut à droite de la fenêtre pour cela
      </p>
      <div className={"flex  c3 " + margin}>
        <MyInput
          styles={" w-full  mr-5 "}
          icon={icfySEND}
          setter={handleChange}
          target={"username"}
        />
        <MyInput
          target={"phone"}
          styles={" w-full  ml-5 "}
          icon={icfySEND}
          setter={handleChange}
        />
      </div>

      <div className="flex items-center">
        <MyInputFile
          styles={margin + "  c3 mr-5"}
          setter={handleChange}
          label={"Photo de profil"}
          target={"image"}
        />
        <MyInputFile
          styles={margin + "  c3 mr-5"}
          setter={handleChange}
          label={"Bannière"}
          target={"banniere"}
        />
        <MyInputFile
          styles={margin + "  c3 mr-5"}
          setter={handleChange}
          label={"CV"}
          target={"cvImg"}
        />
      </div>
      <MyTextArea
        label={"Bio"}
        styles={"w-full "}
        setter={handleChange}
        target={"description"}
      />
    </div>
  );
};

// Social

export const FormEditProfile2 = () => {
  const { state } = useToolsState(null);
  const { cv } = useAuthState();
  const { address } = useAccount();
  const dispatch = useToolsDispatch();
  const dispatchCV = useAuthDispatch();
  let handleChange = async (value, target, attributes) => {
    let metadatas = { ...state?.profile?.metadatas };
    console.log("value", value);
    console.log("metadatas", metadatas?.[target]);
    console.log("value", target);

    if (metadatas[target] == value || metadatas?.[target] == value) {
      throw new Error("Error: Same value");
    }

    metadatas.social[target] = value;

    let uri = await createURI({
      id: state?.profile?.cvID,
      title: "CV",
      metadatas: metadatas,
    });
    await _apiPost("setTokenURIOf", [
      state?.profile?.cvID,
      uri,
      ADDRESSES.cvsHub,
    ]);

    await doStateProfileTools({ dispatch, cvID: state?.profile?.cvID });
    await doAuthCV(dispatchCV, address);
  };

  return (
    <div className={"flex " + margin}>
      <MyInput
        setter={handleChange}
        target={"facebook"}
        icon={icfyFB}
        label={"Facebook"}
      />
      <MyInput
        target={"linkedin"}
        setter={handleChange}
        icon={icfyLINKEDIN}
        label={"Linkedin"}
      />
      <MyInput
        target={"github"}
        setter={handleChange}
        icon={icfyGITHUB2}
        label={"Github"}
      />
      <MyInput
        target={"twitter"}
        setter={handleChange}
        icon={icfyTWITTER}
        label={"Twitter"}
      />
    </div>
  );
};

// Work
export const FormEditProfile3 = () => {
  return (
    <div className="">
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
