import { AssetJob } from "components/assets/AssetJob";
import { AssetProfile } from "components/assets/AssetProfile";
import { MyCardInfos } from "components/myComponents/card/MyCard";
import {
  doStateMissionTools,
  useToolsDispatch,
  useToolsState,
} from "context/tools";
import React, { useEffect, useState } from "react";
import { v4 } from "uuid";
import { motion } from "framer-motion";

import { _apiPost } from "utils/ui-tools/web3-tools";
import { STATUS } from "constants/status";
import { Icon } from "@iconify/react";
import { icfyETHER } from "icones";
import { parseTimestamp } from "helpers";
import { ENUMS } from "constants/enums";

import { MyBtnPost } from "components/btn/MyBtnPost";
import Link from "next/link";
import { useAuthState } from "context/auth";
import { MyFModal } from "components/myComponents/modal/MyFramerModal";
import { MyFormModal } from "components/myComponents/form/MyFormModal";
import { MyInput } from "components/myComponents/form/MyInput";
import { MyMainBtn } from "components/myComponents/btn/MyMainBtn";

export const FeatureInformations = ({ feature }) => {
  let { state, index } = useToolsState();
  let { cv } = useAuthState();

  let dispatch = useToolsDispatch();

  let handlePost = async (func, id) => {
    await _apiPost(func, [id]);
    //! doStateMissionTools(dispatch, state?.mission?.missionID);
  };

  let [isFeature, setIsFeature] = useState(null);

  useEffect(() => {
    if (feature) {
      setIsFeature(feature);
    } else if (state?.features?.[index]) {
      setIsFeature(state?.features?.[index]);
    }
  }, [feature, state?.features?.[index]]);

  let infos = [
    {
      title: "Status",
      value: (
        <p
          className={
            "badge badge-xs h-fit text-xs px-2 badge-outline badge-" +
            STATUS.feature[isFeature?.datas?.status]?.color
          }
        >
          <Icon
            className="mr-4  my-1"
            icon={STATUS.feature[isFeature?.datas?.status]?.icon}
          />
          {STATUS.feature[isFeature?.datas?.status]?.status}
        </p>
      ),
    },
    {
      title: "Started At",
      value: parseTimestamp(isFeature?.datas?.startedAt),
    },

    {
      title: "Temps total alloués",
      value: isFeature?.datas?.estimatedDays,
    },
    {
      title: "Invite only",
      value: `${isFeature?.datas?.isInviteOnly}`,
    },

    {
      title: "Specification",
      value: (
        <>
          <Icon
            icon={ENUMS.courts[isFeature?.datas?.specification]?.badge}
            className="mr-1"
          />
          {ENUMS.courts[isFeature?.datas?.specification]?.court}
        </>
      ),
    },
    isFeature?.datas?.status !== 2 && {
      title: "Wadge",
      value: (
        <p className="flex items-center">
          <Icon icon={icfyETHER} className="text-lg mr-1" />{" "}
          {isFeature?.datas?.wadge}
        </p>
      ),
    },
  ];

  return (
    <div className="flex w-full">
      <MyCardInfos arr={infos} style={"mr-3 w-2/4 rounded-tl-none "}>
        {isFeature?.datas?.cvWorker != 0 && (
          <>
            <motion.div className="my-4 flex  w-fit">
              <div className="flex relative flex-col pb-2 mr-3" key={v4()}>
                <div className="text-[10px] mb-3 items-center text-white/40">
                  Worker
                </div>
                <AssetProfile
                  noBtn={true}
                  color={2}
                  cvID={isFeature?.datas?.cvWorker}
                  target={"worker"}
                />
              </div>
            </motion.div>

            {(isFeature?.datas?.status === 0 ||
              isFeature?.datas?.status === 1) &&
              (isFeature?.datas?.owner == cv ||
                isFeature?.datas?.cvWorker === cv) && (
                <MyMainBtn style={"text-error mr-2"} url={"/create/escrow"}>
                  Contest
                </MyMainBtn>
              )}
            {(isFeature?.datas?.status === 0 ||
              isFeature?.datas?.status === 1) &&
              (isFeature?.datas?.owner == cv ||
                isFeature?.datas?.cvWorker == cv) && (
                <MyBtnPost
                  style={"mr-2 c2"}
                  setter={() =>
                    handlePost("validFeature", isFeature?.featureID)
                  }
                >
                  Validate
                </MyBtnPost>
              )}
            {isFeature?.datas?.startedAt == 0 &&
              !isFeature?.datas?.isInviteOnly && (
                <MyBtnPost
                  setter={() => handlePost("askToJoin", isFeature?.featureID)}
                >
                  Ask to join
                </MyBtnPost>
              )}
          </>
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
          submit={() => handlePost("improveFeature", isFeature?.featureID)}
          styles={{ btn: "" }}
        >
          <div className="min-h-[20vh]">
            <p className="text-xs">
              Êtes-vous sûre de vouloir prolonger le délais pour le claimable
              <span className="text-success">
                {isFeature?.metadatas?.title}?{" "}
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
          feature={isFeature}
          featureID={isFeature?.featureID}
        />
      </motion.div>
    </div>
  );
};
