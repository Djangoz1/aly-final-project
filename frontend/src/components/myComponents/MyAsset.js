import { ImagePin } from "components/Image/ImagePin";
import { Hg, Hg1 } from "components/text/HeroGradient";
import Link from "next/link";
import React from "react";
import { v4 } from "uuid";

export const MyAsset = ({
  banniere,
  image,
  url,
  status,
  style,
  title,
  description,
  details,
}) => {
  return (
    <div
      className={`shadow-2xl bg-gradient-to-l to-zinc-900 from-zinc-900 w-[350px] overflow-hidden rounded-lg flex flex-col ${style}`}
    >
      <div className="max-h-[20vh] overflow-hidden">
        <ImagePin CID={banniere} style=" w-full" />
      </div>
      <div className="gb1 g1 py-[1px] w-[95%] mx-auto"></div>
      <div className="px-5 py-4 flex flex-col">
        <div className="flex">
          {status?.map((el) => (
            <div
              key={v4()}
              className={`badge badge-xs badge-outline py-2 px-4 mr-1 badge-${el?.color}`}
            >
              {el?.title}
            </div>
          ))}
        </div>

        <div className="flex items-center my-5 ">
          <ImagePin CID={image} style="w-[140px] mask mask-hexagon " />
          <div className="flex w-full ml-3 flex-col">
            <Hg1 style="font-white text-lg font-bold">{title}</Hg1>
            <p className=" text-xs text-justify line-clamp-3 text-white/40">
              {description}
            </p>
          </div>
        </div>

        <div className="flex w-full flex-wrap  justify-between">
          {details?.map((el, i) => (
            <div
              className={`flex  text-center flex-col mb-1 w-1/2 ${
                i % 2 === 0 ? "items-start" : "items-end"
              }`}
              key={v4()}
            >
              <div className="text-white/40 text-xs">{el?.title}</div>
              <div className="text-xs ">{el?.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
