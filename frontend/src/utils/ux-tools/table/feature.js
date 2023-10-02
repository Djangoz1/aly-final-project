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

  console.log("fea", features);
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

export const _table_invites = (features) => {
  let list = [];

  for (let index = 0; index < features?.length; index++) {
    const feature = features[index];

    if (feature.details.workerDemand.length > 0)
      for (
        let index = 0;
        index < feature?.details?.workerDemand?.length;
        index++
      ) {
        let workerID = feature?.details?.workerDemand[index];
        list.push({
          id: parseInt(workerID),
          arr: [
            <>{feature?.metadatas?.title}</>,
            <>
              <CVName cvID={workerID} />
            </>,
          ],
          btns: (
            <>
              <div className="flex mx-auto ">
                <button className="btn px-1 btn-ghost">
                  <Icon
                    icon={icfy.ux.garbage}
                    className="text-error  text-2xl "
                  />
                </button>
                <button
                  onClick={async () => {
                    await _apiPost("signWorker", [
                      feature?.featureID,
                      workerID,
                    ]);
                    doStateMission(dispatch, missionID);
                  }}
                  className="btn px-1 btn-ghost"
                >
                  <Icon
                    icon={icfy.ux.check}
                    className="text-success text-2xl"
                  />
                </button>
              </div>
            </>
          ),
        });
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
