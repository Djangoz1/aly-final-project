import { useInView } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import { v4 } from "uuid";

export const MyNum = ({ num, toFix, style, children }) => {
  let [isNums, setIsNums] = useState({ int: [], float: [], ref: null });
  let num1 = `${parseInt(num)}`;
  let ref = useRef(null);
  let isInView = useInView(ref);
  let num2 = num?.toString()?.split(".")?.[1]
    ? parseFloat(num)
        .toFixed(toFix || 2)
        .toString()
        .split(".")[1]
    : undefined;

  useEffect(() => {
    if (isNums?.int?.length === 0 || isNums?.ref != num) {
      let pairs = [];
      let floatsPairs = [];
      for (let i = 0; i < num1?.length; i += 2) {
        const pair = num1.slice(i, i + 2);
        pairs.push(pair);
      }
      for (let i = 0; i < num2?.length; i += 2) {
        const pair = num2.slice(i, i + 2);
        floatsPairs.push(pair);
      }
      setIsNums({ int: pairs, float: floatsPairs, ref: num });
    }
  }, [num]);
  return (
    <span ref={ref} className={`flex items-center ${style}`}>
      {isNums?.int?.map(
        (el, i) =>
          (isNums?.int?.length % 2 !== 0 && i != isNums?.int?.length - 1) ||
          (isNums?.int?.length === 1 && (
            // (i > 0 && parseInt(el) > 0) ||
            <span
              key={`int${i}`}
              className="countdown w-fit m-0   leading-none p-0 tracking-[-0.5px]"
            >
              <span
                style={{
                  "--value": !isInView ? 0 : parseInt(el) || 0,
                }}
              ></span>
            </span>
          ))
      )}
      {isNums?.int?.length % 2 !== 0 && isNums?.int?.length > 1 ? (
        // (i > 0 && parseInt(el) > 0) ||
        <span className=" w-fit m-0   leading-none p-0 tracking-[-0.5px]">
          <span>{isNums?.int?.[isNums?.int?.length - 1]}</span>
        </span>
      ) : (
        <></>
      )}
      {isNums?.float?.length > 0 && "."}
      {isNums?.float?.map((el, i) => (
        <span key={"float " + el + i} className="countdown">
          <span
            key={"float" + el + i}
            style={{
              "--value": !isInView ? 0 : parseInt(el) || 0,
            }}
          ></span>
        </span>
      ))}
      {children}
    </span>
  );
};
