import { Icon } from "@iconify/react";

import { ENUMS } from "constants/enums";

import { STATUS } from "constants/status";
import { icfyETHER } from "icones";
import Link from "next/link";

export let _table_missions = (stateCV, details) => {
  let list = [];

  for (let index = 0; index < details?.missions?.length; index++) {
    const el = details?.missions?.[index];

    let status = STATUS.mission[el?.datas?.status];
    let domain = ENUMS.domain?.[el?.metadatas?.attributes?.[0]?.domain];
    let arr = [
      <div className="flex items-center space-x-3">
        <Icon icon={domain.icon} className="text-[30px]" />
        <div>
          <div className="font-bold text-xs whitespace-nowrap">
            <Link href={`/works/mission/${el?.datas?.id}`}>
              {el?.metadatas?.title}
            </Link>
          </div>
          <div className="text-[10px] opacity-50 uppercase">{domain?.name}</div>
        </div>
      </div>,

      <span className={`text-xs flex items-center ${status.color}`}>
        <Icon className="mr-2 text-xl" icon={status.icon} />
        {status.status}
      </span>,

      <span className="text-white capitalize">
        {ENUMS.experience?.[el?.metadatas?.attributes?.[0]?.experience]?.name}
      </span>,

      <span className={`text-white`}>{el?.datas?.workers}</span>,
      <span className={`text-white`}>{el?.datas?.features?.length}</span>,
      <span className={`text-white`}>{el?.datas?.pubs?.length}</span>,

      <p className="text-right">
        <span className={`text-white mr-2`}>{el?.datas?.amount}</span>
        ETH
      </p>,
    ];
    list.push({ arr, id: parseInt(el?.missionID) });
  }
  return list;
};

export let HEAD_table_missions = [
  "Identity",
  "Status",
  "Temps Restants",
  "Worker(s)",
  "Feature(s)",
  "Pub(s)",
  <Icon className="ml-auto text-xl" icon={icfyETHER} />,
];
