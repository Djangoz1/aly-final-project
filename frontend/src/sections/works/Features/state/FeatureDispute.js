import { MyCardInfos } from "components/myComponents/card/MyCard";
import {
  doStateMissionTools,
  useToolsDispatch,
  useToolsState,
} from "context/tools";
import React, { useState } from "react";
import { _apiPost } from "utils/ui-tools/web3-tools";
import { STATUS } from "constants/status";
import { Icon } from "@iconify/react";
import { parseTimestamp } from "helpers";
import { ENUMS } from "constants/enums";
import { MyCardInfo } from "components/myComponents/card/MyCardInfo";
import { MyBtnPost } from "components/myComponents/btn/MyBtnPost";

import { useAuthState } from "context/auth";

export const FeatureDispute = () => {
  let { state, index } = useToolsState();

  let { cv } = useAuthState();

  let dispatch = useToolsDispatch();

  let handlePost = async (func, id) => {
    await _apiPost(func, [id]);
    doStateMissionTools(dispatch, state?.mission?.missionID);
  };

  let infosDispute = [
    {
      title: "Status",
      value: (
        <p
          className={
            "badge badge-xs h-fit text-xs px-2 badge-outline badge-" +
            STATUS.dispute[
              state?.features?.[index]?.details?.dispute?.datas?.rules?.status
            ]?.color
          }
        >
          {console.log(state?.features?.[index])}
          <Icon
            className="mr-4  my-1"
            icon={
              STATUS.dispute[
                state?.features?.[index]?.details?.dispute?.datas?.rules?.status
              ]?.icon
            }
          />
          {
            STATUS.dispute[
              state?.features?.[index]?.details?.dispute?.datas?.rules?.status
            ]?.status
          }
        </p>
      ),
    },

    state?.features?.[index]?.details?.dispute && {
      title: "Created At",
      value: parseTimestamp(
        state?.features?.[index]?.details?.dispute?.datas?.timers?.createdAt ||
          "Wait init"
      ),
    },

    state?.features?.[index]?.details?.dispute &&
      state?.features?.[index]?.details?.dispute?.datas?.timers?.reclaimedAt >
        0 && {
        title: "Reclaimed At",
        value: parseTimestamp(
          state?.features?.[index]?.details?.dispute?.datas?.timers?.reclaimedAt
        ),
      },

    state?.features?.[index]?.details?.dispute &&
      state?.features?.[index]?.details?.dispute?.datas?.timers?.resolvedAt >
        0 && {
        title: "Resolved At",
        value: parseTimestamp(
          state?.features?.[index]?.details?.dispute?.datas?.timers?.resolvedAt
        ),
      },

    state?.features?.[index]?.details?.dispute &&
      state?.features?.[index]?.details?.dispute?.datas?.timers?.startedAt >
        0 && {
        title: "Started At",
        value: parseTimestamp(
          state?.features?.[index]?.details?.dispute?.datas?.timers?.startedAt
        ),
      },

    state?.features?.[index]?.details?.dispute && {
      title: "Court",
      value:
        ENUMS.courts[state?.features?.[index]?.details?.dispute?.datas?.courtID]
          ?.court,
    },
    state?.features?.[index]?.details?.dispute && {
      title: "Nombre arbitrators",
      value: state?.features?.[index]?.details?.dispute?.datas?.nbArbitrators,
    },
    state?.features?.[index]?.details?.dispute && {
      title: "Decision",
      value:
        state?.features?.[index]?.details?.dispute?.datas?.rules?.decision ||
        "Waiting",
    },
    state?.features?.[index]?.details?.dispute && {
      title: "Appeal delay",
      value: !state?.features?.[index]?.details?.dispute?.datas?.rules
        ?.appeal ? (
        <>
          {state?.features?.[index]?.details?.dispute?.datas?.reclamationPeriod}{" "}
          days
        </>
      ) : (
        "Done"
      ),
    },

    state?.features?.[index]?.details?.dispute && {
      title: "Contest by",
      value: state?.features?.[index]?.details?.dispute?.datas?.ownerContest
        ? "Owner"
        : "Worker",
    },

    state?.features?.[index]?.details?.dispute && {
      title: "Votes",
      value: (
        <>
          {parseInt(
            state?.features?.[index]?.details?.dispute?.datas?.counters
              ?._voteIDs
          )}{" "}
          /{state?.features?.[index]?.details?.dispute?.datas?.nbArbitrators}
        </>
      ),
    },
  ];

  return (
    <>
      <div className="flex w-full">
        <MyCardInfos
          title={"Escrow datas"}
          arr={infosDispute}
          style={"mr-3 w-1/3 rounded-tl-none "}
        >
          <div className=" mt-3 flex justify-end">
            {state?.features?.[index]?.details?.dispute?.datas?.timers
              ?.createdAt == 0 &&
              (state?.features?.[index]?.datas?.cvWorker == cv ||
                state?.features?.[index]?.datas?.owner == cv) && (
                <MyBtnPost
                  setter={() =>
                    handlePost(
                      "initDispute",
                      state?.features?.[index]?.datas?.dispute
                    )
                  }
                >
                  Init
                </MyBtnPost>
              )}
          </div>
        </MyCardInfos>
        <MyCardInfo
          styles={"h-full w-full"}
          color={1}
          btn={{ component: <></> }}
          header={{
            badge: true,
            icon: ENUMS.courts?.[
              state?.features?.[index]?.details?.dispute?.datas?.courtID
            ]?.badge,
            title: `Arbitrators ${parseInt(
              state?.features?.[index]?.datas?.dispute
            )}`,
          }}
          main={{
            title: "Metaevidence",
            text: state?.features?.[index]?.details?.dispute?.metadatas
              ?.description,
          }}
        />
      </div>
    </>
  );
};
