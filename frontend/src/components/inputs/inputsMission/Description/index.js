import React, { useState } from "react";
import { InputText, InputTextArea } from "../..";
import { Icon } from "@iconify/react";
import { ListDevDomains, ListDevLanguages } from "./list";
import { InputAssignedWorker } from "../AssignedWorker";
import { _setFeature } from "utils/ui-tools/mission-tools";

import { useAuthState } from "context/auth";
import { _setterMISSION } from "utils/ui-tools/web3-tools";

export const InputDescription = ({ getter, features, setFeatures }) => {
  const { missionId, missions } = useAuthState();
  const mission = missions[missionId];
  const handleChange = (_description) => {
    const _features = { ...features };
    _features.description.desc = _description;
    setFeatures(_features);
  };

  const [devLanguage, setDevLanguage] = useState(null);
  const [isTitle, setIsTitle] = useState("");

  const handleClick = (language) => {
    setDevLanguage(language);
    const _features = { ...features };
    _features.description.dev = language?.name;
    setFeatures(_features);
  };

  const handleSubmit = async (_features) => {
    await _setFeature(mission, features);
    getter();
  };
  return (
    <>
      <div className="flex">
        <div className="mr-4 flex flex-col">
          <ListDevLanguages setter={handleClick} value={devLanguage} />
          <button
            className="btn  btn-info  mt-auto btn-outlined"
            onClick={() => handleSubmit(features)}
          >
            Ajouter Feature
          </button>
        </div>
        <div className="flex flex-col">
          <ListDevDomains />
          <div className="bg-base-100 p-3 h-fit flex flex-col w-[340px]">
            <span className="flex text-white items-center mb-4">
              <Icon icon={"icon-park-outline:text"} />
              <p className="ml-3 uppercase"> Description</p>
            </span>
            <InputText
              title={"Title"}
              value={isTitle}
              style={{ input: "xs w-full", btn: "xs" }}
              setter={setIsTitle}
            />

            <div className="mt-2">
              <InputTextArea setter={handleChange} title="Description" />
            </div>
          </div>
          <InputAssignedWorker features={features} setFeatures={setFeatures} />
        </div>
      </div>
    </>
  );
};
