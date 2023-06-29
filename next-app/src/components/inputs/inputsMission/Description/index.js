import React, { useEffect, useState } from "react";
import { InputText, InputTextArea } from "../..";
import { DEV_DOMAIN, DEV_LANGUAGES } from "constants/languages";
import { Icon } from "@iconify/react";
import { icfyCODE } from "icones";
import { ListDevDomains, ListDevLanguages } from "./list";
import { InputAssignedWorker } from "../AssignedWorker";

export const InputDescription = ({ features, setFeatures }) => {
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

  return (
    <>
      <div className="flex">
        <div className="mr-4">
          <ListDevLanguages setter={handleClick} value={devLanguage} />
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
        </div>
      </div>

      <label className="label ">Description :</label>
    </>
  );
};
