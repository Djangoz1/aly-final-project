import React, { useEffect, useState } from "react";
import { InputTextArea } from "..";
import { DEV_LANGUAGES } from "constants/languages";
import { Icon } from "@iconify/react";

export const InputDescription = ({ features, setFeatures }) => {
  const handleChange = (_description) => {
    const _features = { ...features };
    _features.description.desc = _description;
    setFeatures(_features);
  };

  const [devLanguage, setDevLanguage] = useState(null);

  const handleClick = (language) => {
    setDevLanguage(language);
    const _features = { ...features };
    _features.description.dev = language?.name;
    setFeatures(_features);
  };

  return (
    <>
      <div className="dropdown">
        <label tabIndex={0} className="btn btn-outline btn-info flex m-1">
          {devLanguage?.name ? (
            <>
              <a>{devLanguage?.name}</a>
              <span style={{ color: devLanguage?.color }}>
                <Icon icon={devLanguage?.icon} />
              </span>
            </>
          ) : (
            "Choose skill"
          )}
        </label>
        <ul
          tabIndex={0}
          className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
        >
          {DEV_LANGUAGES.map((language, index) => (
            <li
              key={language?.icon}
              className="flex flex-row btn justify-between items-center text-white"
              onClick={() => handleClick(language)}
            >
              <a>{language?.name}</a>
              <span
                className={`text-${language?.color}-900`}
                style={{ color: language?.color }}
              >
                <Icon icon={language?.icon} />
              </span>
            </li>
          ))}
        </ul>
      </div>
      <label className="label ">Description :</label>
      <InputTextArea setter={handleChange} title="Description" />
    </>
  );
};
