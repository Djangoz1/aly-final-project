import { Icon } from "@iconify/react";
import { ZERO_ADDRESS } from "constants/web3";
import { useAuthState } from "context/auth";
import { icfyCODER, icfyETHER } from "icones";
import React from "react";

export const StatFeatureFooter = ({ feature, submit, mission }) => {
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
      <p className="text-black"> {parseInt(feature?.wadge)} ETH</p>

      {cv &&
        feature?.assignedWorker === ZERO_ADDRESS &&
        !feature?.isInviteOnly && (
          <button
            className="btn btn-xs btn-success btn-outline ml-auto"
            onClick={() => submit(mission?.address, parseInt(feature?.id))}
          >
            Join Feature
          </button>
        )}
    </div>
  );
};
