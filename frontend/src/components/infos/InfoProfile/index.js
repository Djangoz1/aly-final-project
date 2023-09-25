import { ModalSetCV } from "components/myComponents/modal/ModalSetCV";
import { MyStat } from "components/myComponents/MyStat";
import { profileStats } from "constants/stats";
import { v4 as uuidv4 } from "uuid";
import React from "react";

// Pour le owner mettre en params le resultat de _getStateOwnerByCv(cvAddress)
export const InfoProfileCV = ({ infos }) => {
  const stats = profileStats(infos);

  return (
    <>
      <ModalSetCV />
      <div className="flex pb-4 justify-between items-center">
        <div className="stats w-full">
          {stats?.map((elem) => (
            <MyStat values={elem.values} key={uuidv4()} />
          ))}
        </div>
      </div>
    </>
  );
};
