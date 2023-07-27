import { useAuthState } from "context/auth";
import React, { useEffect, useState } from "react";

import { v4 as uuidv4 } from "uuid";
import { _getAllPubsState } from "utils/ui-tools/pubs-tools";
import {
  _getterPubsHub,
  _setterAccessControl,
  _setterPubsHub,
} from "utils/ui-tools/web3-tools";

import { Icon } from "@iconify/react";
import { icfyHEART, icfyIMG, icfyMISSION, icfySEND } from "icones";
import { MyModal } from "components/modal/MyModal";
import { PubProfile } from "components/Pub/PubProfile";
import { InputText, InputTextArea } from "components/inputs";
import { createPubOnPinata } from "utils/ui-tools/pinata-tools";
import { ImagePin } from "components/Image/ImagePin";

export const Publications = () => {
  const { cv } = useAuthState();
  const [pubs, setPubs] = useState([]);

  const getAllPubs = async () => {
    const pubs = await _getAllPubsState();
    console.log(pubs);
    setPubs(pubs);
  };

  useEffect(() => {
    if (pubs.length === 0) {
      getAllPubs();
    }
  }, [pubs]);

  return (
    <>
      {pubs?.map((pub) => (
        <div
          key={uuidv4()}
          className="bg-white rounded mb-4 p-4 w-full flex flex-col"
        >
          <PubProfile address={pub.owner} style={"mb-5"} />
          <p className="text-black font-black">{pub.title}</p>
          <p className="text-black">{pub.description}</p>
          <div className="w-[340px]">
            {pub?.image && <ImagePin CID={pub?.image} />}
          </div>
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
      ))}
    </>
  );
};
