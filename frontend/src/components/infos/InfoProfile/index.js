import { Icon } from "@iconify/react";
import { CVName } from "components/inputs/inputsCV/CVName";
import { ModalSetCV } from "components/modal/ModalSetCV";
import {
  icfyCODER,
  icfyCOIN,
  icfyCV,
  icfyETHER,
  icfyMISSION,
  icfySETTINGS,
} from "icones";
import React from "react";

// Pour le owner mettre en params le resultat de _getStateOwnerByCv(cvAddress)
export const InfoProfileCV = ({ infos }) => {
  return (
    <div className="flex border border-x-0 border-t-0 pb-4 border-black/20">
      <Icon icon={icfyCV} className="text-[60px] text-primary" />
      <div className="flex items-end  ">
        <div className="flex flex-col ">
          <p className="text-black text-[23px] leading-none font-bold">
            <CVName address={infos?.cvAddress} />
          </p>
          <p className="text-black leading-none text-[7px] text-black/70">
            CV : {infos?.cvAddress}
          </p>
          <p className="text-black leading-none text-[7px] text-black/70">
            Owner : {infos?.address}
          </p>
        </div>

        <div className="flex items-end mx-10">
          <Icon icon={icfyCOIN} className="text-2xl text-black/70" />
          <p className="text-black  leading-none ml-3 mr-10 font-bold">
            {infos?.amountDispersed}
          </p>
          <Icon icon={icfyMISSION} className="text-2xl text-black/70" />
          <p className="text-black  leading-none ml-3 mr-10 font-bold">
            {infos?.missions?.length}
          </p>
          <Icon icon={icfyCODER} className="text-2xl text-black/70" />
          <p className="text-black text leading-none font-bold ml-3">
            {infos?.features?.length}
          </p>
        </div>
      </div>
      <ModalSetCV />
    </div>
  );
};
