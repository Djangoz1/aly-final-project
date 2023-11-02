import { Icon } from "@iconify/react";
import { MyStatus } from "components/myComponents/item/MyStatus";
import { MySub } from "components/myComponents/text/MySub";

import { ENUMS } from "constants/enums";

import { STATUS } from "constants/status";
import { icfyETHER } from "icones";
import Link from "next/link";

export let _table_missions = (details) => {
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

      <span className="text-white capitalize">
        {ENUMS.experience?.[el?.metadatas?.attributes?.[0]?.experience]?.name}
      </span>,

      <span className={`text-white`}>{el?.datas?.workers}</span>,
      <span className={`text-white`}>{el?.datas?.features?.length}</span>,
      <span className={`text-white`}>{el?.datas?.pubs?.length}</span>,

      <div className="text-right flex flex-col items-end">
        <span className={`text-white text-lg `}>
          {el?.datas?.amount}
          <MySub style={"c4 ml-1"}>ETH</MySub>
        </span>
      </div>,
    ];
    list.push({
      arr,
      id: parseInt(el?.missionID),
      component: (
        <MyStatus
          status={el?.datas?.status}
          target={"mission"}
          padding={"px-2 py-1 "}
          style={` mt-2 text-[8px] p-0`}
        >
          <Icon className="mr-2 text-xl" icon={status.icon} />
          {status.status}
        </MyStatus>
      ),
    });
  }
  return list;
};

export let HEAD_table_missions = [
  "Identity",
  "Expérience min.",
  "Worker(s)",
  "Feature(s)",
  "Pub(s)",
  <Icon className="ml-auto text-xl" icon={icfyETHER} />,
];