import React, { useEffect, useState } from "react";
import { PubProfile } from "./PubProfile";
import { ImagePin } from "components/Image/ImagePin";
import { Icon } from "@iconify/react";
import { icfyHEART, icfyMISSION } from "icones";
import { _getPubState } from "utils/ui-tools/pubs-tools";
import { MyModal } from "components/modal/MyModal";
import { MyCard } from "components/myComponents/MyCard";

export const Pub = ({ id }) => {
  const [pub, setPub] = useState(null);

  const getData = async () => {
    const data = await _getPubState(id);
    setPub(data);
  };
  useEffect(() => {
    if (!pub) getData();
  }, [pub]);
  return (
    <MyCard>
      <PubProfile address={pub?.owner} style={"mb-5"} />
      <div className="flex flex-col border border-y-0 border-r-0 border-l-4 border-white/20 pl-[5vw] ml-[2vw]">
        <p className="text-white font-black">{pub?.title}</p>
        <p className="text-white">{pub?.description}</p>
        <MyModal
          styles={{ btn: "ghost btn-ghost w-fit p-0 my-5" }}
          btn={
            <div className="w-[55px]">
              {pub?.image && <ImagePin CID={pub?.image} />}
            </div>
          }
          modal={
            <div className="w-full">
              {pub?.image && <ImagePin CID={pub?.image} />}
            </div>
          }
        />
        <div className="flex ">
          <div className="flex mr-4 text-black/40 hover:text-info cursor-pointer">
            <Icon
              icon={icfyMISSION}
              className=" hover:text-info  text-2xl mr-2"
            />
            No Mission
          </div>
          <div className="flex hover:text-info cursor-pointer">
            <Icon icon={icfyHEART} className=" text-2xl mr-2 " />0
          </div>
        </div>
      </div>
    </MyCard>
  );
};
