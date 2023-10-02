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
    <Link
      href={url}
      className={`shadow-2xl bg-gradient-to-l to-zinc-800 from-zinc-700 w-[350px] overflow-hidden rounded-lg flex flex-col ${style}`}
    >
      <ImagePin CID={banniere} style=" w-full" />
      <div className="gb1 g1 py-[1px] w-full"></div>
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
          <ImagePin CID={image} style="w-16 mask mask-squircle " />
          <div className="flex w-full ml-3 flex-col">
            <Hg1 style="font-white text-lg font-bold">{title}</Hg1>
            <p className=" text-xs text-justify line-clamp-3 text-white/40">
              {description}
            </p>
          </div>
        </div>

        <div className="flex w-full  flex-col">
          {details?.map((el) => (
            <div className="flex justify-between mb-1 items-center" key={v4()}>
              <span className="text-white/40 text-xs">{el?.title}</span>
              <p className="text-xs items-center">{el?.value}</p>
            </div>
          ))}
        </div>
      </div>
    </Link>
  );
};
