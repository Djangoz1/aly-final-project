import { useFormState } from "context/form";
import React from "react";
import { v4 as uuidv4 } from "uuid";

export const MySteps = ({ arr, styles }) => {
  let { pointer } = useFormState();
  return (
    <ul className={`steps steps-vertical     h-full ${styles || "w-full"}`}>
      {arr.map((el, index) => (
        <li
          key={uuidv4()}
          data-content={el?.i}
          className={`step px-5 border border-y-1 m-0 text-xs   w-full border-x-0 ${
            index === pointer ? "border-primary/70" : "border-white/10"
          } ${
            index <= pointer
              ? " text-white step-primary bg-black/70"
              : "text-white/40 bg-black/10"
          }`}
        >
          {el?.title}
        </li>
      ))}
    </ul>
  );
};
