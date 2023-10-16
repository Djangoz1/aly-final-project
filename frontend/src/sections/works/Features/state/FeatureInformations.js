import { AssetJob } from "components/assets/AssetJob";
import { AssetProfile } from "components/assets/AssetProfile";
import { MyCardInfos } from "components/myComponents/card/MyCard";
import {
  doStateMissionTools,
  useToolsDispatch,
  useToolsState,
} from "context/tools";
import React, { useState } from "react";
import { v4 } from "uuid";
import { motion } from "framer-motion";

import { _apiPost } from "utils/ui-tools/web3-tools";
import { STATUS } from "constants/status";
import { Icon } from "@iconify/react";
import { icfyETHER } from "icones";
import { parseTimestamp } from "helpers";
import { ENUMS } from "constants/enums";

import { MyBtnPost } from "components/myComponents/btn/MyBtnPost";
import Link from "next/link";
import { useAuthState } from "context/auth";
import { MyFModal } from "components/myComponents/modal/MyFramerModal";
import { MyFormModal } from "components/myComponents/form/MyFormModal";
import { MyInput } from "components/myComponents/form/MyInput";

export const FeatureInformations = () => {
  let { state, index } = useToolsState();
  let { cv } = useAuthState();

  let dispatch = useToolsDispatch();

  let handlePost = async (func, id) => {
    await _apiPost(func, [id]);
    doStateMissionTools(dispatch, state?.mission?.missionID);
  };

  let infos = [
    {
      title: "Status",
      value: (
        <p
          className={
            "badge badge-xs h-fit text-xs px-2 badge-outline badge-" +
            STATUS.feature[state?.features?.[index]?.datas?.status]?.color
          }
        >
          {console.log(state?.features?.[index])}
          <Icon
            className="mr-4  my-1"
            icon={STATUS.feature[state?.features?.[index]?.datas?.status]?.icon}
          />
          {STATUS.feature[state?.features?.[index]?.datas?.status]?.status}
        </p>
      ),
    },
    {
      title: "Started At",
      value: parseTimestamp(state?.features?.[index]?.datas?.startedAt),
    },

    {
      title: "Temps total alloués",
      value: state?.features?.[index]?.datas?.estimatedDays,
    },
    {
      title: "Invite only",
      value: `${state?.features?.[index]?.datas?.isInviteOnly}`,
    },

    {
      title: "Specification",
      value: (
        <>
          <Icon
            icon={
              ENUMS.courts[state?.features?.[index]?.datas?.specification]
                ?.badge
            }
            className="mr-1"
          />
          {ENUMS.courts[state?.features?.[index]?.datas?.specification]?.court}
        </>
      ),
    },
    state?.features?.[index]?.datas?.status !== 2 && {
      title: "Wadge",
      value: (
        <p className="flex items-center">
          <Icon icon={icfyETHER} className="text-lg mr-1" />{" "}
          {state?.features?.[index]?.datas?.wadge}
        </p>
      ),
    },
  ];

  return (
    <div className="flex w-full">
      <MyCardInfos arr={infos} style={"mr-3 w-1/3 rounded-tl-none "}>
        {state?.features?.[index]?.datas?.cvWorker != 0 && (
          <>
            <motion.div className="mt-4 flex  w-fit">
              <div className="flex relative flex-col pb-2 mr-3" key={v4()}>
                <div className="text-[10px] mb-3 items-center text-white/40">
                  Worker
                </div>
                <AssetProfile
                  noBtn={true}
                  color={2}
                  cvID={state?.features?.[index]?.datas?.cvWorker}
                  target={"worker"}
                />
              </div>
            </motion.div>

            {(state?.features?.[index]?.datas?.status === 0 ||
              state?.features?.[index]?.datas?.status === 1) &&
              (state?.features?.[index]?.datas?.owner == cv ||
                state?.features?.[index]?.datas?.cvWorker === cv) && (
                <Link
                  className="btn btn-xs btn-error mr-2"
                  href={"/create/escrow"}
                >
                  Contest
                </Link>
              )}
            {(state?.features?.[index]?.datas?.status === 0 ||
              state?.features?.[index]?.datas?.status === 1) &&
              (state?.features?.[index]?.datas?.owner == cv ||
                state?.features?.[index]?.datas?.cvWorker == cv) && (
                <MyBtnPost
                  setter={() =>
                    handlePost(
                      "validFeature",
                      state?.features?.[index]?.featureID
                    )
                  }
                >
                  Validate
                </MyBtnPost>
              )}
          </>
        )}
        {state?.features?.[index]?.datas?.startedAt == 0 &&
          !state?.features?.[index]?.datas?.isInviteOnly && (
            <MyBtnPost
              setter={() =>
                handlePost("askToJoin", state?.features?.[index]?.featureID)
              }
            >
              Ask to join
            </MyBtnPost>
          )}

        <MyFormModal
          stateInit={{
            form: {
              target: "Improve",
              estimatedDays: null,
            },
            placeholders: {
              estimatedDays: "30 days",
            },
          }}
          btns={{ btn: "Improve", submit: "Confirm" }}
          submit={() =>
            handlePost("improveFeature", state?.features?.[index]?.featureID)
          }
          styles={{ btn: "btn btn-xs text-info mt-2  btn-outline " }}
        >
          <div className="min-h-[20vh]">
            <p className="text-xs">
              Êtes-vous sûre de vouloir prolonger le délais pour le claimable
              <span className="text-success">
                {state?.features?.[index]?.metadatas?.title}?{" "}
              </span>
            </p>

            <div className="flex flex-col">
              <span className="text-white/60  text-[10px]">
                En confirmant, la claimable période seras mis à jour en fonction
                du temps que vous indiquer.
              </span>
              <span className="text-white/60  text-[10px]">
                Please be sure to have reason to do that. Worker can contest
                this prolongation and will win if you haven't reason to do that.
              </span>
            </div>
            <MyInput type={"number"} target={"estimatedDays"} />
          </div>
        </MyFormModal>
      </MyCardInfos>
      <motion.div className=" w-full relative flex" key={v4()}>
        <AssetJob
          style={" w-full rounded-tl-none h-full"}
          noBtn={true}
          feature={state?.features?.[index]}
          featureID={state?.features?.[index]?.featureID}
        />
      </motion.div>
    </div>
  );
};
