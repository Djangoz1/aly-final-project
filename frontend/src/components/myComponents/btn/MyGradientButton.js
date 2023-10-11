import React from "react";
import { styles } from "styles/style";

export const BtnG1 = ({ children, setter, style, disabled }) => {
  return (
    <button
      onClick={() => (setter ? setter() : null)}
      disabled={disabled}
      className={
        styles.gbtn +
        (disabled ? " text-white/40 opacity-80 p-0 " : " text-white g1 ") +
        style
      }
    >
      {children}
    </button>
  );
};

export const BtnGr1 = ({ children, setter, style, disabled }) => {
  return (
    <button
      onClick={() => setter() || null}
      disabled={disabled}
      className={
        styles.gbtn +
        (disabled ? " text-white/40 opacity-80 p-0 " : " text-white  gr2 ") +
        style
      }
    >
      {children}
    </button>
  );
};

export const BtnGb2 = ({ children, setter, style, disabled }) => {
  let padding = " p-[2px]";
  if (disabled) {
    padding = "p-0";
  }
  return (
    <BtnGb1 disabled={disabled} setter={setter} style={style + padding}>
      <div className="w-full backdrop-blur    flex items-center justify-center rounded-lg h-full">
        {children}
      </div>
    </BtnGb1>
  );
};
export const BtnGr2 = ({ children, setter, style, disabled }) => {
  let padding = " p-[2px]";
  if (disabled) {
    padding = "p-0";
  }
  return (
    <BtnGr1 disabled={disabled} setter={setter} style={style + padding}>
      <div className="w-full backdrop-blur    flex items-center justify-center rounded-lg h-full">
        {children}
      </div>
    </BtnGr1>
  );
};

export const BtnGb1 = ({ children, setter, style, disabled }) => {
  return (
    <button
      onClick={() => (setter ? setter() : null)}
      disabled={disabled}
      className={
        styles.gbtn +
        (disabled ? " text-white/40 opacity-80 p-0 " : " text-white g1 gb2 ") +
        style
      }
    >
      {children}
    </button>
  );
};
