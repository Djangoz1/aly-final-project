import { Icon } from "@iconify/react";
import { CVName } from "components/inputs/inputsCV/CVName";
import { MyCountdown, MyCounter } from "components/myComponents/MyCountdown";
import { MyStatus } from "components/myComponents/item/MyStatus";
import { ENUMS } from "constants/enums";
import { STATUS } from "constants/status";
import { doStateMission } from "context/hub/mission";
import { calcTimeRemaining, parseTimestamp } from "helpers";
import { icfy, icfyETHER } from "icones";
import Link from "next/link";
import { _apiPost } from "utils/ui-tools/web3-tools";
import { timestampToCounter } from "utils/ux-tools";

export let _table_launchpad = (launchpads, owner) => {
  let list = [];

  for (let index = 0; index < launchpads?.length; index++) {
    const el = launchpads[index];

    let status = STATUS.launchpad[el?.datas?.status];
    let domain = ENUMS.domain[el?.metadatas?.attributes?.[0]?.domain];
    let arr = [
      <div className="flex flex-col items-center">
        <Icon icon={domain?.icon} className="text-[20px]" />
        <span className="badge badge-primary  mt-2 badge-xs text-[9px] py-2">
          {domain?.name}
        </span>
      </div>,
      <div className="flex items-center ">
        <div>
          <Link
            href={`/launchpad/${el?.launchpadID}`}
            className="font-bold  whitespace-nowrap hover:text-info"
          >
            {el?.metadatas?.title}
          </Link>
          <div className=" opacity-50">
            {el?.owner ? (
              <CVName metadata={el?.owner} />
            ) : (
              <CVName cvID={el?.datas.owner} />
            )}
          </div>
        </div>
      </div>,

      <div className="flex flex-col items-start">
        <span>{el?.datas?.tokenPrice}</span>
        <span>{el?.datas?.tokenSymbol}</span>
      </div>,
      <div className={` flex flex-col items-center text-[10px]`}>
        {el?.datas?.currentTier}/{el?.datas?.numberOfTier}
      </div>,
      <>
        <MyCountdown size={10} timestamp={parseInt(el?.datas?.saleStart)} />
      </>,
      <p className="text-right text-[10px]">
        <span className={`text-white mr-2`}>{el?.datas?.amountRaised}</span>
        ETH
      </p>,
    ];
    list.push({
      arr,
      id: parseInt(el?.launchpadID),
      component: (
        <MyStatus
          status={el?.datas?.status}
          target={"launchpad"}
          padding={"px-2 py-1 "}
        />
      ),
    });
  }
  return list;
};

export let HEAD_table_launchpads = [
  "",
  "Launchpad",
  "Tokens",
  "Rounds",
  "Temps Restants",
  <Icon className="ml-auto text-xl" icon={icfyETHER} />,
];
