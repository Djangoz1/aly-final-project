import { Icon } from "@iconify/react";
import { CVName } from "components/inputs/inputsCV/CVName";
import { ENUMS } from "constants/enums";
import { STATUS } from "constants/status";
import { icfyETHER } from "icones";
import Link from "next/link";
import { timestampToCounter } from "utils/ux-tools";

export let _table_features = (features, owner) => {
  let list = [];

  console.log("fea", features);
  for (let index = 0; index < features?.length; index++) {
    const el = features[index];

    let court = ENUMS.courts[el?.datas?.specification];
    let status = STATUS.feature[el?.datas?.status];
    let arr = [
      <Icon icon={court.badge} className="text-[30px]" />,
      <div className="flex items-center ">
        <div>
          <Link
            href={`/works/mission/${el?.datas?.missionID}/features`}
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
          <CVName cvID={el?.details?.signedWorker} styles={"text-white"} />
        ) : (
          <span className="text-warning">Waiting</span>
        )}

        <span className="badge badge-primary  mt-3 badge-sm">
          {court.court}
        </span>
      </div>,

      <span
        className={` flex items-center ${
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
            <span className="text-[9px]">
              Candidacy
              {el?.datas?.isInviteOnly ? " closed" : " open"}
            </span>
          </div>
        )}
      </div>,
      <p className="text-right">
        <span className={`text-white mr-2`}>{el?.datas?.wadge}</span>
        ETH
      </p>,
    ];
    list.push({ arr, id: parseInt(el?.featureID) });
  }
  return list;
};

export let HEAD_table_features = [
  "",
  "Identity",
  "Work",
  "Status",
  "Temps Restants",
  <Icon className="ml-auto text-xl" icon={icfyETHER} />,
];