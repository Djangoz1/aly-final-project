import { Icon } from "@iconify/react";
import { DEV_DOMAIN, DEV_LANGUAGES } from "constants/languages";
import { icfyCODE } from "icones";
import { useState } from "react";

export const ListDevLanguages = ({ setter, value }) => {
  return (
    <div className="flex flex-wrap p-3  shadow bg-base-100 justify-between w-[240px] ">
      <h5 className="w-full text-white items-center flex">
        <Icon icon={icfyCODE} />
        <span className="ml-3 "> DEV</span>
      </h5>
      {DEV_LANGUAGES.map((language, index) => (
        <li
          key={language?.icon}
          className={`flex flex-col btn w-[100px] my-2 items-center
              justify-center text-white  ${
                value?.name === language?.name ? "btn-primary" : null
              }`}
          onClick={() => setter(language)}
        >
          <Icon icon={language?.icon} style={{ color: language?.color }} />

          <a className="text-xs">{language?.name}</a>
        </li>
      ))}
    </div>
  );
};

export const ListDevDomains = ({ setter, value }) => {
  const [isDomain, setIsDomain] = useState();
  const handleClick = (value) => {
    setIsDomain(value);
  };
  return (
    <div className="flex flex-wrap p-3 h-fit shadow bg-base-100 justify-between w-[340px] ">
      <h5 className="w-full text-white items-center flex">
        <Icon icon={"carbon:task"} />
        <span className="ml-3 "> DOMAIN</span>
      </h5>

      {DEV_DOMAIN.map((domain, index) => (
        <li
          key={domain?.icon}
          className={`flex flex-col btn p-0 w-[100px] my-2 items-center
              justify-center text-white  ${
                isDomain?.name === domain?.name ? "btn-primary" : null
              }`}
          onClick={() => handleClick(domain)}
        >
          <Icon icon={domain?.icon} style={{ color: domain?.color }} />

          <p className="text-xs">{domain?.name}</p>
        </li>
      ))}
    </div>
  );
};
