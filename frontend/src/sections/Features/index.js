import { FeatureAmount } from "components/Feature/FeatureAmount";
import { FeatureInfo } from "components/Feature/FeatureInfo";
import { FeatureTiming } from "components/Feature/FeatureTiming";
import { FeatureWorker } from "components/Feature/FeatureWorker";

import { ChatMission } from "components/inputs/inputsMission/ChatMission";
import { InputDescription } from "components/inputs/inputsMission/Description";
import { ZERO_ADDRESS } from "constants/web3";
import { useAuthState } from "context/auth";

import {
  doFeaturesState,
  useMissionDispatch,
  useMissionState,
} from "context/authMissions";

import React, { useEffect, useState } from "react";
import { _getStateFeatures } from "utils/ui-tools/auth-tools";
import { _getFeatures, _setFeature } from "utils/ui-tools/mission-tools";

export const CreationFeatures = () => {
  const { missions, missionId } = useAuthState();

  const [features, setFeatures] = useState([]);

  const getFeatures = async () => {
    if (missions && missionId != null && missionId < missions.length) {
      const _features = await _getStateFeatures(missions[missionId]);
      setFeatures(_features);
    }
  };

  useEffect(() => {
    getFeatures();
  }, [missions, missionId]);

  return (
    <div>
      {features?.map((feature, index) => (
        <details className="collapse bg-base-200" key={feature?.oppenedAt}>
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
