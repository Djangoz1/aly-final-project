import React from "react";

export const MySub = ({ style, children, size }) => {
  return (
    <div
      className={`cursor-default  ${" uppercase " + style} ${
        size ? `text-[${size}px]` : "text-xs"
      }`}
    >
      {children}
    </div>
  );
};
