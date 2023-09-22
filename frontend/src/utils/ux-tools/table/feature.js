import { Icon } from "@iconify/react";
import { CVName } from "components/inputs/inputsCV/CVName";
import { ENUMS } from "constants/enums";
import { STATUS } from "constants/status";
import { icfyETHER } from "icones";
import { timestampToCounter } from "utils/ux-tools";

export let _table_features = (stateMission) => {
  let list = [];
  let features = stateMission.features;
  let owner = stateMission.owner;
  console.log(stateMission);
  for (let index = 0; index < features?.length; index++) {
    const el = features[index];

    let court = ENUMS.courts[el?.datas?.specification];
    let status = STATUS.feature[el?.datas?.status];
    let arr = [
      <div className="flex items-center space-x-3">
        <Icon icon={court.badge} className="text-[30px]" />
        <div>
          <div className="font-bold text-sm whitespace-nowrap">
            {el?.metadatas?.title}
          </div>
          <div className="text-xs opacity-50">
            <CVName metadata={owner} />
          </div>
        </div>
      </div>,
      <div className="flex text-xs flex-col">
        {el?.details?.signedWorker ? (
          <CVName cvID={el?.details?.signedWorker} styles={"text-white"} />
        ) : (
          <span className="text-warning">Waiting</span>
        )}

        <span className="badge badge-primary text-xs mt-3 badge-sm">
          {court.court}
        </span>
      </div>,

      <span
        className={`text-xs flex items-center ${
          el?.details?.signedWorker
            ? status.color
            : STATUS._feature.hiring.color
        }`}
      >
        <Icon
          className="mr-2 text-xl"
          icon={
            el?.details?.signedWorker
              ? status.icon
              : STATUS._feature.hiring.icon
          }
        />
        {el?.details?.signedWorker
          ? status.status
          : STATUS._feature.hiring.status}
      </span>,
      <div className={` flex items-center text-[10px]`}>
        {el?.details?.signedWorker ? (
          <>
            Claimable in
            {timestampToCounter(
              el?.datas?.startedAt,
              el?.datas?.estimatedDays,
              "text-white"
            )}
          </>
        ) : (
          <p>
            <span className="text-white mr-2">
              {el?.details?.workerDemand?.length}
            </span>
            candidate(s)
            <br />
            <span className="text-[9px]">
              Candidacy
              {el?.datas?.isInviteOnly ? " closed" : " open"}
            </span>
          </p>
        )}
      </div>,
      <p>
        <span className={`text-white mr-2`}>{el?.datas?.wadge}</span>
        ETH
      </p>,
    ];
    list.push({ arr, id: parseInt(el?.featureID) });
  }
  return list;
};

export let HEAD_table_features = [
  "Identity",
  "Work",
  "Status",
  "Temps Restants",
  <Icon className="ml-auto text-xl" icon={icfyETHER} />,
];
