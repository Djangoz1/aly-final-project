import React from "react";

export const MySub = ({ style, children, size }) => {
  return (
    <div
      className={`cursor-default font-[500] tracking-[1.2px] ${
        " uppercase " + style
      } ${size ? `text-[${size}px]` : "text-xs"}`}
    >
      {children}
    </div>
  );
};
