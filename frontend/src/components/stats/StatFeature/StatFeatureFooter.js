import { Icon } from "@iconify/react";
import { BtnJoinFeature } from "components/btn/BtnJoinFeature";
import { BtnToProfileCV } from "components/btn/BtnToProfileCV";
import { ZERO_ADDRESS } from "constants/web3";
import { useAuthState } from "context/auth";
import { icfyCODER, icfyETHER } from "icones";
import { ethers } from "ethers";
import React from "react";

export const StatFeatureFooter = ({ feature, submit, mission, link }) => {
  const { cv } = useAuthState();
  return (
    <div className="flex items-center mt-4">
      <Icon
        icon={icfyCODER}
        className={`text-2xl ${
          feature?.assignedWorker !== ZERO_ADDRESS
            ? "text-error"
            : "text-success"
        }
      `}
      />
      <p className="ml-1 mr-3 text-black">
        {feature?.assignedWorker !== ZERO_ADDRESS ? 1 : 0}
      </p>
      <Icon icon={icfyETHER} className="text-2xl text-black/70" />
      <p className="text-black">
        {ethers.utils.formatEther(`${parseInt(feature?.wadge)}`)} ETH
      </p>

      {cv &&
        submit &&
        feature?.assignedWorker === ZERO_ADDRESS &&
        !feature?.isInviteOnly && (
          <BtnJoinFeature
            missionAddr={mission?.address}
            featureId={parseInt(feature?.id)}
            getter={submit}
          />
        )}

      {link && <BtnToProfileCV cvAddress={mission?.ownerAddress} />}
    </div>
  );
};
