import { Icon } from "@iconify/react";
import { DEV_DOMAIN, DEV_LANGUAGES } from "constants/languages";
import { icfyCODE } from "icones";
import { useState } from "react";

export const ListDevLanguages = ({ setter, value }) => {
  return (
    <div className="flex flex-wrap p-3  shadow bg-white justify-between w-2/3 border rounded border-primary ">
      <h5 className="w-full text-black items-center flex">
        <Icon icon={icfyCODE} />
        <span className="ml-3 "> DEV</span>
      </h5>
      {DEV_LANGUAGES.map((language, index) => (
        <li
          key={language?.icon}
          className={`flex flex-col btn w-[100px] my-2 items-center
              justify-center text-white  ${
                value === language?.name ? "btn-primary" : "bg-neutral-700"
              }`}
          onClick={() => setter(language.name)}
        >
          <Icon icon={language?.icon} style={{ color: language?.color }} />

          <a className="text-xs">{language?.name}</a>
        </li>
      ))}
    </div>
  );
};

export const ListDevDomains = ({ setter, value }) => {
  const handleClick = (value) => {
    setter(value);
  };
  return (
    <div className="flex flex-wrap p-3 h-fit shadow bg-white rounded justify-between w-[340px] ">
      <h5 className="w-full text-black items-center flex">
        <Icon icon={"carbon:task"} />
        <span className="ml-3 "> DOMAIN</span>
      </h5>

      {DEV_DOMAIN.map((domain, index) => (
        <li
          key={domain?.icon}
          className={`flex flex-col btn p-0 w-[100px] my-2 items-center
              justify-center text-white  ${
                value === domain?.name ? "btn-primary" : "bg-neutral-600"
              }`}
          onClick={() => handleClick(domain.name)}
        >
          <Icon icon={domain?.icon} style={{ color: domain?.color }} />

          <p className="text-xs">{domain?.name}</p>
        </li>
      ))}
    </div>
  );
};
