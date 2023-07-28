import { LogoIc } from "components/Logo";
import { CVName } from "components/inputs/inputsCV/CVName";
import React from "react";

export const PubProfile = ({ address, style }) => {
  return (
    <div className={`flex ${style}`}>
      <img
        alt="photo profile"
        src={"/profile.jpeg"}
        className="w-[70px] rounded-full "
      />
      <div className="flex flex-col justify-end ml-5">
        <CVName styles={"text-white font-bold text-2xl"} address={address} />
        <span className="text-[9px]">{address}</span>
      </div>
      <LogoIc styles={"ml-auto"} />
    </div>
  );
};
