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
    {
      title: "Status",
      value: (
        <p
          className={
            "badge badge-xs h-fit text-xs px-2 badge-outline badge-" +
            STATUS.dispute[isDispute?.datas?.rules?.status]?.color
          }
        >
          {console.log(state?.features?.[index])}
          <Icon
            className="mr-4  my-1"
            icon={STATUS.dispute[isDispute?.datas?.rules?.status]?.icon}
          />
          {STATUS.dispute[isDispute?.datas?.rules?.status]?.status}
        </p>
      ),
    },

    isDispute && {
      title: "Created At",
      value: parseTimestamp(isDispute?.datas?.timers?.createdAt || "Wait init"),
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
      <div className="flex flex-col w-full">
        <MyCardInfos
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
        <MyCardInfo
          noBtn={true}
          styles={"h-full flex flex-col   w-full"}
          color={1}
          header={{
            badge: true,
            icon: ENUMS.courts?.[isDispute?.datas?.courtID]?.badge,
            title: `Dispute - ${isDispute?.metadatas?.title}`,
          }}
          main={{
            title: "Metaevidence",
            text: isDispute?.metadatas?.description,
          }}
        >
          {console.log("isDispute", isDispute)}
          <div className="   absolute bottom-4 right-4 flex items-center">
            {isAllowance?.allow === 1 && (
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
            {isDispute?.datas?.rules?.status === 2 &&
              isAllowance?.allow === 3 && (
                <>
                  <MyBtnPost
                    setter={async () => {
                      await _apiPost("vote", [isDispute?.disputeID, 1]);
                      fetch();
                    }}
                    style={"text-warning mr-4"}
                  >
                    Equal
                  </MyBtnPost>
                  <MyBtnPost
                    setter={async () => {
                      await _apiPost("vote", [isDispute?.disputeID, 2]);
                      fetch();
                    }}
                    style={"text-info"}
                  >
                    Payer
                  </MyBtnPost>
                  <MyBtnPost
                    setter={async () => {
                      await _apiPost("vote", [isDispute?.disputeID, 3]);
                      fetch();
                    }}
                    style={"text-success ml-4 "}
                  >
                    Payee
                  </MyBtnPost>
                </>
              )}
            {isDispute?.datas?.rules?.status === 3 &&
              !isDispute?.datas?.rules?.appeal &&
              (cv == isDispute?.datas?.payerID ||
                cv == isDispute?.datas?.payeeID) && (
                <>
                  <MyBtnPost
                    setter={async () => {
                      await _apiPost("appeal", [isDispute?.disputeID]);
                      fetch();
                    }}
                    style={"text-warning mr-4"}
                  >
                    Appeal
                  </MyBtnPost>
                  <MyBtnPost
                    setter={async () => {
                      await _apiPost("resolvedDispute", [isDispute?.disputeID]);
                      fetch();
                    }}
                    style={"text-success"}
                  >
                    Resolved
                  </MyBtnPost>
                </>
              )}
          </div>
        </MyCardInfo>
      </div>
    </>
  );
};
