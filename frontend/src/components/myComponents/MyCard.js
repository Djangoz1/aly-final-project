import { Icon } from "@iconify/react";
import React, { useState } from "react";

export const MyCard = ({ children, icon, styles }) => {
  let [isClicked, setIsClicked] = useState(null);
  return (
    <div
      className={`relative bg-black/40 p-4  z-0 h-fit  rounded-xl border box-border border-white/10  font2 shadow-xl ${styles}`}
    >
      <div className="w-full h-full" onClick={() => setIsClicked(false)}>
        {children}
      </div>
    </div>
  );
};
