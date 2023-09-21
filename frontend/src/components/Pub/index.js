import React, { useEffect, useState } from "react";

import { statePub } from "utils/ui-tools/state-tools";

import { CVName } from "components/inputs/inputsCV/CVName";
import { ImagePin } from "components/Image/ImagePin";
import { _apiGet } from "utils/ui-tools/web3-tools";
import { ADDRESSES } from "constants/web3";
import { fetchJSONByCID } from "utils/ui-tools/pinata-tools";
import { Icon } from "@iconify/react";
import { icfyBUBBLE, icfyHEART, icfyMISSION } from "icones";
import { MyModal } from "components/modal/MyModal";
import { LogoIc } from "components/Logo";

export const Pub = ({ id, _owner }) => {
  const [isDatas, setIsDatas] = useState(null);

  const state = async () => {
    const pub = await statePub(id);
    let owner;
    if (!_owner) {
      let uriOwner = await _apiGet("tokenURIOf", [
        pub?.owner,
        ADDRESSES["cvsHub"],
      ]);
      owner = await fetchJSONByCID(uriOwner);
    } else {
      owner = _owner;
    }
    setIsDatas({ pub, owner });
  };

  useEffect(() => {
    if (!isDatas) state();
  }, [isDatas]);
  return (
    <div className={"flex min-h-[15vh] h-fit relative items-start"}>
      <div className="avatar mb-auto">
        <ImagePin CID={isDatas?.owner?.image} style={"w-12 rounded-full"} />
      </div>

      <LogoIc styles={"absolute bottom-0 left-2"} />

      <div className="flex h-fit border border-l-1 border-white/10 border-y-0 border-r-0  px-5 flex-col ml-5 ">
        <CVName
          styles={"text-white font-semibold text-sm"}
          metadata={isDatas?.owner}
          cvID={isDatas?.pub?.owner}
        />
        <p>{isDatas?.pub?.metadata?.description}</p>
        {isDatas?.pub?.metadata?.image && (
          <MyModal
            styles={{ btn: "ghost btn-ghost w-fit p-0 my-5" }}
            btn={
              <div className="w-[55px]">
                <ImagePin CID={isDatas?.pub?.metadata?.image} />
              </div>
            }
            modal={
              <div className="w-fit">
                <ImagePin
                  CID={isDatas?.pub?.metadata?.image}
                  style={"w-full"}
                />
              </div>
            }
          />
        )}
        <div className="flex items-end">
          <div className="flex mr-4 hover:text-secondary cursor-pointer">
            <Icon icon={icfyBUBBLE} className="text-2xl mr-1" />
            {isDatas?.pub?.answers?.length || 0}
          </div>
          <div className="flex mr-4 hover:text-secondary cursor-pointer ">
            <Icon icon={icfyHEART} className=" text-2xl mr-1  " />
            {isDatas?.pub?.likes}
          </div>
          <div
            className={
              isDatas?.pub?.metadata?.attributes?.[0]?.reference
                ? "text-blue-600 cursor-pointer"
                : "text-red-900"
            }
          >
            <Icon icon={icfyMISSION} className=" text-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
};
