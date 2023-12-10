import { MyCardInfos } from "components/myComponents/card/MyCard";
import {
  doStateMissionTools,
  doStateProfileTools,
  useToolsDispatch,
  useToolsState,
} from "context/tools";
import React, { useEffect, useState } from "react";
import { _apiGet, _apiPost } from "utils/ui-tools/web3-tools";
import { STATUS } from "constants/status";
import { Icon } from "@iconify/react";
import { calcTimeRemaining, calcTimestamp, parseTimestamp } from "helpers";
import { ENUMS } from "constants/enums";
import { MyCardInfo } from "components/myComponents/card/MyCardInfo";
import { MyBtnPost } from "components/btn/MyBtnPost";

import { useAuthState } from "context/auth";
import { MyCountdown, MyCounter } from "components/myComponents/MyCountdown";
import { stateDispute } from "utils/ui-tools/state-tools";

export const FeatureDispute = ({ disputeID, dispute }) => {
  console.log("diospyute", disputeID);
  let { state, index } = useToolsState();
  let auth = useAuthState();
  let { cv, details } = useAuthState();

  let [isDispute, setIsDispute] = useState(null);
  let [isAllowance, setCanArbitrate] = useState(false);

  let fetchState = async () => {
    if (disputeID) {
      setIsDispute(await stateDispute(disputeID));
    } else if (dispute) {
      setIsDispute(dispute);
    } else if (state?.features?.[index]?.details?.dispute) {
      setIsDispute(state?.features?.[index]?.details?.dispute);
    }
  };
  let fetch = async () => {
    for (let index = 0; index < details?.arbitrators?.length; index++) {
      let elem = details?.arbitrators?.[index]?.disputes?.filter(
        (el) => el?.disputeID === isDispute?.disputeID
      )?.[0];
      if (elem?.allowance) {
        let allowance = {
          allow: elem?.allowance,
          vote: null,
        };
        if (elem?.allowance === 3) {
          allowance.vote = await _apiGet("voteOfArbitrator", [
            isDispute?.disputeID,
            details?.arbitrators?.[index]?.arbitratorID,
          ]);
        }
        setCanArbitrate(allowance);
        break;
      }
    }
  };

  useEffect(() => {
    if (!isDispute || isDispute?.disputeID != disputeID) {
      fetchState();
    }
    fetch();
    if (cv && isDispute?.datas?.rules?.status === 0) {
    }
  }, [cv, disputeID, index]);

  let dispatch = useToolsDispatch();

  let handlePost = async (func, id) => {
    await _apiPost(func, [id]);
    if (disputeID) {
      doStateProfileTools({ dispatch, cvID: state?.owner?.cvID });
    } else {
      doStateMissionTools(dispatch, state?.mission?.missionID);
    }

    fetch();
  };

  let infosDispute = [
    isDispute && {
      title: "Created At",
      value: isDispute?.metadatas?.created,
    },
    isDispute && {
      title: "Descripition",
      value: isDispute?.metadatas?.description,
    },
    isDispute && {
      title: "Appeal",
      value: <>{`${isDispute?.datas?.rules?.appeal}`}</>,
    },
    isDispute && {
      title: "Min Closed At",
      value: <>Reclamation period + createdAt</>,
    },

    isDispute &&
      isDispute?.datas?.timers?.reclaimedAt > 0 && {
        title: "Reclaimed At",
        value: parseTimestamp(isDispute?.datas?.timers?.reclaimedAt),
      },

    isDispute &&
      isDispute?.datas?.timers?.resolvedAt > 0 && {
        title: "Resolved At",
        value: parseTimestamp(isDispute?.datas?.timers?.resolvedAt),
      },

    isDispute &&
      isDispute?.datas?.timers?.startedAt > 0 && {
        title: "Started At",
        value: parseTimestamp(isDispute?.datas?.timers?.startedAt),
      },

    isDispute && {
      title: "Court",
      value: ENUMS.courts[isDispute?.datas?.courtID]?.court,
    },
    isDispute && {
      title: "Nombre arbitrators",
      value: isDispute?.datas?.nbArbitrators,
    },
    isDispute && {
      title: "Decision",
      value: ["Waiting", "Equal", "Payer", "Payee"]?.[
        isDispute?.datas?.rules?.decision
      ],
    },
    isDispute && {
      title: "Reclamation period",
      value: !isDispute?.datas?.rules?.appeal ? (
        <>{isDispute?.datas?.reclamationPeriod} days</>
      ) : (
        "Done"
      ),
    },

    isDispute && {
      title: "Contest by",
      value: isDispute?.datas?.ownerContest ? "Owner" : "Worker",
    },

    isDispute && {
      title: "Votes",
      value: (
        <>
          {parseInt(isDispute?.datas?.counters?._voteIDs)} /
          {isDispute?.datas?.nbArbitrators}
        </>
      ),
    },
  ];

  console.log("can arbitrate", isAllowance);

  return (
    <>
      <>
        <MyCardInfos
          template={6}
          title={"Escrow datas"}
          arr={infosDispute}
          style={"mr-3 w-full rounded-tl-none "}
        >
          <div className=" mt-3 flex justify-end">
            {isDispute?.datas?.timers?.createdAt == 0 &&
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

            {isAllowance === 2 && (
              <>
                <MyBtnPost
                  setter={() =>
                    handlePost("acceptArbitration", [isDispute?.datas?.id])
                  }
                >
                  Accept Arbitration
                </MyBtnPost>
                <MyBtnPost
                  style={"btn-xs btn-error btn-outline ml-2"}
                  setter={() =>
                    handlePost("refuseArbitration", [isDispute?.datas?.id])
                  }
                >
                  Refuse
                </MyBtnPost>
              </>
            )}
          </div>
        </MyCardInfos>
      </>
    </>
  );
};
