import { Icon } from "@iconify/react";
import React, { useState } from "react";

export const MyCard = ({ head, children, icon, styles }) => {
  let [isClicked, setIsClicked] = useState(null);
  return (
    <div
      className={`relative bg-zinc-900 py-4 px-6   z-0 h-fit  rounded-xl  box-border   font2 shadow-xl ${styles}`}
    >
      {head && (
        <h6 className="text-white text-lg items-center mb-3 flex">
          <Icon icon={head?.icon} className="text-xl mr-2" /> {head?.title}
        </h6>
      )}
      <div className="w-full h-full" onClick={() => setIsClicked(false)}>
        {children}
      </div>
    </div>
  );
};
