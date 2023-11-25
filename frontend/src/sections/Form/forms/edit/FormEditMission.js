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
import {
  clientPocket,
  createURI,
  createURICv,
} from "utils/ui-tools/pinata-tools";
import { _apiPost } from "utils/ui-tools/web3-tools";
import { useAccount } from "wagmi";
let margin = "mb-8";
// Identity
export const FormEditMission1 = () => {
  const { state } = useToolsState(null);
  const { cv, metadatas } = useAuthState();
  const { address } = useAccount();
  const dispatch = useToolsDispatch();
  const dispatchCV = useAuthDispatch();
  let handleChange = async (value, target, attributes) => {
    let _metadatas = { ...metadatas };
    console.log("value", value);
    console.log("metadatas", _metadatas?.[target]);
    console.log("value", target);

    if (_metadatas[target] == value || _metadatas?.[target] == value) {
      throw new Error("Error: Same value");
    }

    if (
      target === "username" ||
      target === "image" ||
      target === "description"
    ) {
      _metadatas[target] = value;
    } else if (target === "phone") {
      _metadatas.identity[target] = value;
    } else if (target === "banniere") {
      _metadatas[target] = value;
    }
    return;
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
        La majorité des informations de la missions sont intangible afun de ne
        pas comprommettre le contrat entre les différents partis à la mission.
        <br />
        <br />
      </p>
      <ul className="text-xs c4 w-3/4 mb-5">
        Vous ne pourrez ainsi pas changer :<li>- La description</li>
        <li>- Le domaine de la mission</li>
        <li>- La specification d'une feature</li>
        <li>- ...</li>
      </ul>

      <div className="flex items-center">
        <MyInputFile
          styles={margin + "  c3 mr-5"}
          label={"Image profile"}
          metadatas={state?.mission?.metadatas}
          target={"image"}
        />
        <MyInputFile
          metadatas={state?.mission?.metadatas}
          styles={margin + "  c3 mr-5"}
          label={"Bannière"}
          target={"banniere"}
        />
      </div>
      <MyTextArea
        metadatas={state?.mission?.metadatas}
        label={"Abstract description"}
        styles={"w-full "}
        target={"abstract"}
      />
    </div>
  );
};

// Social
