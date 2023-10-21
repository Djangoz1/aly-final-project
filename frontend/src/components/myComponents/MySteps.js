import { Hg, Hg1 } from "components/text/HeroGradient";
import {
  doStateFormPointer,
  useFormDispatch,
  useFormState,
} from "context/form";
import React from "react";
import { v4 as uuidv4 } from "uuid";

export const MySteps = ({ arr, styles }) => {
  let { pointer } = useFormState();
  let dispatch = useFormDispatch();
  return (
    <ul
      className={`steps steps-vertical  font2    h-fit ${styles || "w-full"}`}
    >
      {arr.map((el, index) => (
        <li
          key={uuidv4()}
          data-content={el?.i}
          className={`step px-5  cursor-pointer relative border-y-1 rounded-lg m-0 text-xs  text-left whitespace-nowrap w-full border-x-0 ${
            index === pointer
              ? "border-none bg-white/10 font-bold shadow2 "
              : "border-white/10 "
          } ${
            index === pointer ? " text-white  " : "text-white/40 opacity-40"
          }`}
          onClick={() =>
            index <= pointer && doStateFormPointer(dispatch, index)
          }
        >
          <div
            className={` g1  rounded-full h-1/2   absolute  left-0 -translate-x-1/2 -translate-y-1/2 top-1/2 ${
              pointer >= index ? "gb1  py-5 px-[3px] " : "h-1/2 px-[1px] gr1"
            }`}
          ></div>
          <p>{el?.title}</p>
        </li>
      ))}
    </ul>
  );
};
