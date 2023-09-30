import { ImagePin } from "components/Image/ImagePin";
import Link from "next/link";
import React from "react";
import { v4 } from "uuid";

export const MyAsset = ({
  banniere,
  image,
  url,
  title,
  description,
  details,
}) => {
  return (
    <Link
      href={url}
      className="bg-zinc-700 w-[400px] overflow-hidden rounded-lg flex flex-col"
    >
      <ImagePin CID={banniere} style="w-full" />
      <div className="px-5 py-4 flex flex-col">
        <div className="flex">
          <div className="btn btn-xs mr-1">
            <div className="badge badge-xs badge-warning" /> Registration open
          </div>
          <div className="btn btn-xs">Gaming</div>
        </div>
        <div className="flex items-center my-5 ">
          <ImagePin CID={image} style="w-16 mask mask-squircle " />
          <div className="flex ml-3 flex-col">
            <h6 className="font-white text-lg font-bold">{title}</h6>
            <p className="w-[250px] text-xs text-justify line-clamp-3 text-white/40">
              {description}
            </p>
          </div>
        </div>
        <div className="flex w-full  flex-col">
          {details?.map((el) => (
            <div className="flex justify-between items-center" key={v4()}>
              <span className="text-white/40 text-xs">{el?.title}</span>
              <p className="text-sm items-center">{el?.value}</p>
            </div>
          ))}
        </div>
      </div>
    </Link>
  );
};
