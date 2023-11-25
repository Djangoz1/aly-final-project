import { Icon } from "@iconify/react";
import { CVName } from "components/inputs/inputsCV/CVName";
import { MyStatus } from "components/myComponents/item/MyStatus";
import { ENUMS } from "constants/enums";
import { STATUS } from "constants/status";
import { doStateMission } from "context/hub/mission";
import { icfy, icfyETHER } from "icones";
import Link from "next/link";
import { _apiPost } from "utils/ui-tools/web3-tools";
import { timestampToCounter } from "utils/ux-tools";

export let _table_arbitrators = (arbitrators) => {
  let list = [];

  for (let index = 0; index < arbitrators?.disputes?.length; index++) {
    const el = arbitrators?.disputes[index];

    let court = ENUMS.courts[el?.datas?.courtID];

    let arr = [
      <div className="flex items-center ">
        <Icon icon={court?.badge} className="text-3xl mr-1" />

        <div className="flex flex-col">
          <p className="font-bold  whitespace-nowrap hover:text-info">
            {el?.metadatas?.title}
          </p>
          <MyStatus
            style={"px-3 text-[9px]"}
            status={el?.datas?.rules?.status}
            target={"dispute"}
          />
        </div>
      </div>,
      <div className="flex  flex-col">
        {el?.datas?.arbitrators?.length} / {el?.datas?.nbArbitrators}
      </div>,
      <div className="flex  flex-col">
        {parseInt(el?.datas?.reclamationPeriod)}
      </div>,
      <div className="flex  items-center">
        <MyStatus
          style={"px-3"}
          status={el?.datas?.allowance}
          target={"arbitratorForDispute"}
        />
      </div>,
    ];
    list.push({ arr, id: parseInt(el?.disputeID) });
  }
  console.log("list", list);
  return list;
};

export let HEAD_table_arbitrators = [
  "Title",
  "Nombre arbitrators",
  "Reclamation Period",
  "Status",
];
