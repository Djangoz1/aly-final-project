import { Icon } from "@iconify/react";
import { icfy } from "icones";
import Link from "next/link";
import React from "react";
import { v4 } from "uuid";
import { MyCard } from "./MyCard";
import { MyNum } from "../text/MyNum";

export const MyCardPrice = ({
  price,
  url,
  btn,
  size,
  style,
  badge,
  active,
  color,
  lists,
  template,
  description,
}) => {
  let colors = [
    { bg: "bg-primary/10", text: "text-primary" },
    { bg: "bg-secondary/10", text: "text-secondary" },

    { bg: "bg-[#0caeb929]", text: "text-[#0caeb9]" },
    { bg: "bg-[#cf8f1329]", text: "text-[#cf8f13]" },
  ];

  return (
    <MyCard
      styles={`${style && style}  flex ${
        active
          ? "bg-gradient-to-tr from-[#232F41] to-[#10172B] via-[#171E33]"
          : "border border-white/20"
      }  flex-col px-8   py-8 ${size || " min-w-[282px]"}`}
      template={5}
    >
      <div
        className={` rounded-lg  flex items-center  ${colors[color || 0].text}`}
      >
        <Icon icon={badge?.icon} className="mr-3" />
        <p className="font-bold ">{badge?.title}</p>
      </div>
      <span className="mb-6 mt-3   items-start flex font-extrabold text-2xl">
        {price ? (
          <>
            {price}

            <span className="text-sm  ml-1 c4">ETH</span>
          </>
        ) : (
          "Free"
        )}
      </span>
      <div className="mb-6 font-light c4 text-xs md:mb-10 lg:mb-12">
        {description ||
          "Lorem ipsum dolor sit amet consectetur adipiscing elit ut aliquam, purussit"}
      </div>

      {lists?.map((el) =>
        el?.title ? (
          <div key={v4()} className="mb-5 flex items-center flex-row">
            <div
              className={`mr-5 text-white  h-6 w-6 rounded-full text-lg flex items-center justify-center shadow ${
                el?.check ? "bg-green-800" : "bg-error/40"
              }`}
            >
              {el?.check ? "✓" : "⛌"}
            </div>

            <div className={`whitespace-nowrap opacity-50`}>{el?.title}</div>
          </div>
        ) : undefined
      )}
      {btn !== false && (
        <Link
          href={url || "#"}
          className={`mt-5  w-full rounded-lg  py-2 hover:scale-105 text-center font-bold  transition  border   ${
            active
              ? "bg-[#125C40] border-transparent "
              : "border-[#125C40] text-[#125C40]   "
          }`}
        >
          Get started today
        </Link>
      )}
    </MyCard>
  );
};
