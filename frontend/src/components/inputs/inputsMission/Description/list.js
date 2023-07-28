import { Icon } from "@iconify/react";
import { MyCard } from "components/myComponents/MyCard";
import { DEV_DOMAIN, DEV_LANGUAGES } from "constants/languages";
import { icfyCODE } from "icones";
import { useState } from "react";

export const ListDevLanguages = ({ setter, value }) => {
  return (
    <MyCard styles={"flex flex-wrap justify-between w-full"}>
      <h5 className="w-full text-white items-center flex">
        <Icon icon={icfyCODE} />
        <span className="ml-3 "> DEV</span>
      </h5>
      {DEV_LANGUAGES.map((language, index) => (
        <li
          key={language?.icon}
          className={`flex flex-col btn  w-[100px] my-2 items-center  btn-primary
              justify-center text-white  ${
                value !== language?.name && "btn-outline"
              }`}
          onClick={() => setter(language.name)}
        >
          <Icon
            icon={language?.icon}
            className="text-xl"
            style={{ color: language?.color }}
          />

          <a className="text-[10px]">{language?.name}</a>
        </li>
      ))}
    </MyCard>
  );
};

export const ListDevDomains = ({ setter, value }) => {
  const handleClick = (value) => {
    setter(value);
  };
  return (
    <MyCard styles={"flex flex-wrap justify-between w-[340px]"}>
      <h5 className="w-full text-white items-center flex">
        <Icon icon={"carbon:task"} />
        <span className="ml-3 "> DOMAIN</span>
      </h5>

      {DEV_DOMAIN.map((domain, index) => (
        <li
          key={domain?.icon}
          className={`flex flex-col btn  w-[100px] my-2 items-center  btn-primary
              justify-center text-white  ${
                value !== domain?.name && "btn-outline"
              }`}
          onClick={() => handleClick(domain.name)}
        >
          <Icon
            icon={domain?.icon}
            className="text-xl"
            style={{ color: domain?.color }}
          />

          <p className="text-[10px]">{domain?.name}</p>
        </li>
      ))}
    </MyCard>
  );
};
