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
      styles={`${style && style} px-8 pt-4 pb-8 ${size || " min-w-[282px]"}`}
      template={1}
    >
      <div
        className={`mb-4 rounded-lg ${
          colors[color || 0].bg
        } flex items-center px-5 py-2 ${colors[color || 0].text}`}
      >
        <Icon icon={badge?.icon} className="mr-3" />
        <p className="font-bold ">{badge?.title}</p>
      </div>
      <div className="mb-6 font-light c4 md:mb-10 lg:mb-12">
        {description ||
          "Lorem ipsum dolor sit amet consectetur adipiscing elit ut aliquam, purussit"}
      </div>
      <h2 className="my-6 pb-8 text-3xl items-start flex font-extrabold md:text-5xl">
        {price ? (
          <>
            {price}

            <span className="text-sm  ml-1 c4">ETH</span>
          </>
        ) : (
          "Free"
        )}
      </h2>
      {!btn?.no && (
        <Link
          href={url || "#"}
          className={`mb-5 inline-block  shadowh _hover w-full rounded-lg  px-6 py-4 text-center font-bold  transition hover:border-black  lg:mb-8 ${
            active
              ? "bg-[#c9fd02] text-black hover:text-[#c9fd02]  hover:bg-neutral-900"
              : "bg-neutral-900 c4 hover:bg-[#c9fd02] hover:text-black"
          }`}
        >
          Get started
        </Link>
      )}
      {lists?.map((el) =>
        el?.title ? (
          <div key={v4()} className="mt-2 flex items-center flex-row">
            <div
              className={`mr-5  w-fit p-2 rounded-full shadow ${
                el?.check ? colors[color || 0]?.bg : "bg-error/40"
              }`}
            >
              <Icon
                icon={el?.check ? icfy.ux.check.casual : icfy.ux.check.uncheck}
              />
            </div>

            <div
              className={`whitespace-nowrap ${
                el?.check ? "text-success/70" : "text-error"
              }`}
            >
              {el?.title}
            </div>
          </div>
        ) : undefined
      )}
    </MyCard>
  );
};
