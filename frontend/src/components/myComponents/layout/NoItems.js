import React from "react";

import { Icon } from "@iconify/react";
import { icfy } from "icones";
import { MySub } from "../text/MySub";

export const NoItems = ({ style, template, target, icon }) => {
  return (
    <div
      className={`w-full  flex flex-col ${
        ["magicpattern1", "magicpattern"]?.[template || 0]
      } relative  ${style || "min-h-[30vh]"}`}
    >
      <div className="backdrop-blur w-4/5 bg-white/5 absolute flex items-center gap-4 rounded bottom-0 left-1/2 px-3 py-2 -translate-x-1/2  -translate-y-full">
        <div className="rounded-full w-fit bg-white/5 p-3 ">
          <Icon icon={icon || icfy.person.add} className="text-4xl" />
        </div>
        <MySub>{target || "Notifications"} not found</MySub>
      </div>
    </div>
  );
};
