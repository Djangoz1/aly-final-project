import { Hg, Hg1 } from "components/text/HeroGradient";
import { useFormState } from "context/form";
import React from "react";
import { v4 as uuidv4 } from "uuid";

export const MySteps = ({ arr, styles }) => {
  let { pointer } = useFormState();
  return (
    <ul
      className={`steps steps-vertical  font2    h-full ${styles || "w-full"}`}
    >
      {arr.map((el, index) => (
        <li
          key={uuidv4()}
          data-content={el?.i}
          className={`step px-5 border border-y-1 m-0 text-xs  text-left whitespace-nowrap w-full border-x-0 ${
            index === pointer
              ? "border-none cta-button project-owner"
              : "border-white/10"
          } ${
            index <= pointer
              ? " text-white step-primary "
              : "text-white/40 bg-black/10"
          }`}
        >
          {index === pointer ? <p>{el?.title}</p> : <Hg>{el?.title}</Hg>}
        </li>
      ))}
    </ul>
  );
};
