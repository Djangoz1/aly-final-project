import { Icon } from "@iconify/react";
import { ImagePin } from "components/Image/ImagePin";
import { CVName } from "components/inputs/inputsCV/CVName";
import { MyCard } from "components/myComponents/MyCard";
import { icfyURL } from "icones";
import React from "react";

export const LaunchpadIdentity = ({ datas }) => {
  return (
    <MyCard styles={"justify-center w-full flex flex-col items-center"}>
      <div className="flex  items-center">
        <div className="w-[60px] h-[60px] overflow-hidden">
          <ImagePin CID={datas?.metadata?.image} style={"rounded-full"} />
        </div>
        <h6 className="text-white text-xl ml-3 font-bold">
          {datas?.metadata?.title}
        </h6>
      </div>
      <div className="flex flex-col capitalize btn items-center bg-black/70 rounded border border-black/70 shadow my-2 w-full">
        <span className="text-xs">Owner</span>
        <CVName address={datas?.owner} styles={"text-white font-bold"} />
      </div>
      <p className="text-white flex items-center">
        Official website
        <Icon icon={icfyURL} className="text-sm ml-1 text-secondary" />
      </p>
    </MyCard>
  );
};
