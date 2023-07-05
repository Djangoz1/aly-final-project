import { Icon } from "@iconify/react";
import { Logo } from "components/Logo";
import { icfyFB, icfyINSTA, icfyLINKEDIN, icfyTWITTER } from "icones";
import React from "react";

export const Footer = () => {
  const icons = [icfyFB, icfyINSTA, icfyLINKEDIN, icfyTWITTER];
  return (
    <div className="w-full bg-white">
      <div className="border border-x-0 border-top-black/50 box-border pt-4 w-[90%] mx-auto h-[10vh] flex items-start  mt-auto">
        <div className="flex">
          {icons.map((icon) => (
            <Icon
              key={icon}
              icon={icon}
              className="text-2xl mr-5 cursor-pointer"
            />
          ))}
        </div>
        <div className="flex w-1/5 ml-10 justify-between ">
          <p>Terms of use</p>
          <p>Privacy</p>
          <p>About us</p>
        </div>
        <div className="ml-auto">
          <Logo />
        </div>
      </div>
    </div>
  );
};
