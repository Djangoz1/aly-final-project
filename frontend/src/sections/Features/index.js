import { FeatureAmount } from "components/Feature/FeatureAmount";
import { FeatureInfo } from "components/Feature/FeatureInfo";
import { FeatureTiming } from "components/Feature/FeatureTiming";
import { FeatureWorker } from "components/Feature/FeatureWorker";

import { ChatMission } from "components/inputs/inputsMission/ChatMission";
import { InputDescription } from "components/inputs/inputsMission/Description";
import { ZERO_ADDRESS } from "constants/web3";
import { useAuthState } from "context/auth";
import { v4 as uuidv4 } from "uuid";

import React, { useEffect, useState } from "react";
import {
  _getStateFeature,
  _getStateFeatures,
  _getStateOwnerByCv,
} from "utils/ui-tools/auth-tools";
import { _getFeatures, _setFeature } from "utils/ui-tools/mission-tools";
import { _getterMissionsHub } from "utils/ui-tools/web3-tools";
import { StatFeature } from "components/stats/StatFeature";

export const CreationFeatures = () => {
  const { missions, missionId } = useAuthState();
  const { cv } = useAuthState();

  const [features, setFeatures] = useState([]);
  const [ownerObj, setOwnerObj] = useState(null);
  const getFeatures = async () => {
    setOwnerObj({ cvAddress: cv });
    if (missions && missionId != null) {
      const _features = await _getterMissionsHub("getFeaturesIndexer", [
        missionId,
      ]);
      const arr = [];
      for (let index = 0; index < _features.length; index++) {
        const featureId = parseInt(_features[index]);
        const featureData = await _getStateFeature(featureId);
        arr.push(featureData);
      }
      setFeatures(arr);
    }
  };

  console.log(features);
  useEffect(() => {
    if (cv) {
      getFeatures();
    }
  }, [missions, missionId]);

  return (
    <div>
      <div className="my-5 flex flex-wrap   w-fit">
        {features?.map((feature, index) => (
          <StatFeature obj={ownerObj} feature={feature} key={uuidv4()} />
        ))}
      </div>
      <details className="collapse bg-primary border border-primary">
        <summary className="collapse-title text-xl font-medium">
          Click to open/close
        </summary>
        <div className="collapse-content">
          <CreationFeature getter={getFeatures} />
        </div>
      </details>
    </div>
  );
};

export const CreationFeature = ({ getter }) => {
  let [datas, setDatas] = useState({
    metadata: {
      title: "",
      image: "",
      description: "",
      devLanguage: "",
      domain: "",
      url: "",
    },
    estimatedDays: 0,
    wadge: 0,
    isInviteOnly: false,
    assignedWorker: `${ZERO_ADDRESS}`,
  });

  return (
    <>
      <div className="flex justify-between">
        <div className="flex flex-col">
          <InputDescription getter={getter} datas={datas} setDatas={setDatas} />
        </div>
        {/* <ChatMission features={datas} /> */}
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
