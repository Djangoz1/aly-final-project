import { Icon } from "@iconify/react";
import { CVName } from "components/inputs/inputsCV/CVName";
import { ENUMS } from "constants/enums";
import { STATUS } from "constants/status";
import { doStateMission } from "context/hub/mission";
import { icfy, icfyETHER } from "icones";
import Link from "next/link";
import { _apiPost } from "utils/ui-tools/web3-tools";
import { timestampToCounter } from "utils/ux-tools";

export let _table_features = (features, owner) => {
  let list = [];

  for (let index = 0; index < features?.length; index++) {
    const el = features[index];

    let court = ENUMS.courts[el?.datas?.specification];
    let status = STATUS.feature[el?.datas?.status];
    let arr = [
      <div className="flex flex-col items-center">
        <Icon icon={court.badge} className="text-[20px]" />
        <span className="badge badge-primary  mt-2 badge-xs text-[9px] py-2">
          {court.court}
        </span>
      </div>,
      <div className="flex items-center ">
        <div>
          <Link
            href={`/works/mission/${el?.datas?.missionID}#section2`}
            className="font-bold  whitespace-nowrap hover:text-info"
          >
            {el?.metadatas?.title}
          </Link>
          <div className=" opacity-50">
            {owner ? (
              <CVName metadata={owner} />
            ) : (
              <CVName cvID={el?.datas.owner} />
            )}
          </div>
        </div>
      </div>,
      <div className="flex  flex-col">
        {el?.details?.signedWorker ? (
          <CVName cvID={el?.details?.signedWorker} styles={""} />
        ) : (
          <span className="text-warning">Waiting</span>
        )}
      </div>,

      <div className={` flex flex-col justify-center text-[10px]`}>
        {el?.details?.signedWorker ? (
          <div className=" whitespace-nowrap">
            {timestampToCounter(
              el?.datas?.startedAt,
              el?.datas?.estimatedDays,
              "text-white"
            )}
          </div>
        ) : (
          <div className="flex flex-col">
            <p>
              {!el?.datas?.isInviteOnly ? (
                <>
                  <span className="text-white mr-2">
                    {el?.details?.workerDemand?.length}
                  </span>
                  candidate(s)
                </>
              ) : (
                <>Must assign worker</>
              )}
            </p>
          </div>
        )}
        <span
          className={` flex badge-xs  mt-2 text-[9px] badge badge-outline py-2  items-center badge-${
            el?.details?.signedWorker
              ? status.color
              : STATUS._feature.hiring.color
          }`}
        >
          <Icon
            className="mr-2 "
            icon={
              el?.details?.signedWorker
                ? status.icon
                : STATUS._feature.hiring.icon
            }
          />
          {el?.details?.signedWorker
            ? status.status
            : STATUS._feature.hiring.status}
        </span>
      </div>,
      <p className="text-right text-[10px]">
        <span className={`text-white mr-2`}>{el?.datas?.wadge}</span>
        ETH
      </p>,
    ];
    list.push({ arr, id: parseInt(el?.featureID) });
  }
  return list;
};
export let _table_invites = (features) => {
  let list = [];

  for (let index = 0; index < features?.length; index++) {
    const feature = features?.[index];
    if (parseInt(feature?.datas?.startedAt) === 0) {
      let arr = [
        <Icon
          icon={ENUMS.courts[feature.datas.specification].badge}
          className="text-2xl"
        />,
        <div className="flex items-center">
          <div className="flex flex-col">
            <p className="text-sm text-white">{feature.metadatas.title}</p>
            <p className="">
              {ENUMS.courts[feature.datas.specification].court}
            </p>
          </div>
        </div>,
        <div className="">
          <CVName cvID={feature.datas.owner} />
        </div>,
        <div className="">{feature.datas.estimatedDays}</div>,
        <div className="text-right">{feature.datas.wadge} ETH</div>,
      ];
      list.push({ arr, id: parseInt(feature?.datas?.id) });
    }
  }

  return list;
};

export let HEAD_table_features = [
  "",
  "Identity",
  "Worker",

  "Temps Restants",
  <Icon className="ml-auto text-xl" icon={icfyETHER} />,
];

export let HEAD_table_invites = ["Job", "Worker"];
