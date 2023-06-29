import { ZERO_ADDRESS } from "@openzeppelin/test-helpers/src/constants";

import { FeatureAmount } from "components/Feature/FeatureAmount";
import { FeatureInfo } from "components/Feature/FeatureInfo";
import { FeatureTiming } from "components/Feature/FeatureTiming";
import { FeatureWorker } from "components/Feature/FeatureWorker";

import { InputAssignedWorker } from "components/inputs/inputsMission/AssignedWorker";
import { ChatMission } from "components/inputs/inputsMission/ChatMission";
import { InputDescription } from "components/inputs/inputsMission/Description";
import { InputEstimatedDay } from "components/inputs/inputsMission/EstimatedDay";
import { InputInviteOnly } from "components/inputs/inputsMission/InviteOnly";
import { InputWadge } from "components/inputs/inputsMission/Wadge";

import {
  doFeaturesState,
  useMissionDispatch,
  useMissionState,
} from "context/authMissions";

import React, { useEffect, useState } from "react";
import { _getFeatures, _setFeature } from "utils/ui-tools/mission-tools";

export const CreationFeatures = () => {
  const { features, mission } = useMissionState();
  const dispatch = useMissionDispatch();

  useEffect(() => {
    if (mission) {
      doFeaturesState(dispatch, mission);
    }
  }, [mission]);

  return (
    <div>
      {features?.map((feature, index) => (
        <details
          className="collapse bg-base-200"
          key={feature?.oppenedAt?._hex}
        >
          <summary className="collapse-title text-xl font-medium">
            Feature #{index}
          </summary>
          <div className="collapse-content">
            <FeatureDescription feature={feature} />
          </div>
        </details>
      ))}
      <details className="collapse bg-base-200">
        <summary className="collapse-title text-xl font-medium">
          Click to open/close
        </summary>
        <div className="collapse-content">
          <CreationFeature />
        </div>
      </details>
    </div>
  );
};

export const CreationFeature = () => {
  let { mission } = useMissionState();
  let [features, setFeatures] = useState({
    description: { desc: "", dev: "" },
    estimatedDay: 0,
    wadge: 0,
    inviteOnly: false,
    assignedWorker: `${ZERO_ADDRESS}`,
  });

  return (
    <>
      <div className="flex justify-between">
        <div className="flex flex-col">
          <InputDescription features={features} setFeatures={setFeatures} />
        </div>
        <ChatMission features={features} />
      </div>
    </>
  );
};

export const FeatureDescription = ({ feature }) => {
  return (
    <div className="stats shadow">
      <FeatureInfo feature={feature} />
      <FeatureAmount feature={feature} />
      <FeatureWorker feature={feature} />
      <FeatureTiming feature={feature} />
    </div>
  );
};
