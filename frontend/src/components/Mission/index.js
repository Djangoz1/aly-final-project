import { FeatureAmount, MissionAmount } from "components/Mission/MissionAmount";
import { MissionTextInfo } from "components/Mission/MissionTextInfo";
import {
  FeatureTiming,
  MissionDataInfo,
} from "components/Feature/MissionDataInfo";
import { FeatureWorker, MissionGithub } from "components/Mission/MissionGithub";
import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import { fetchJSONByCID } from "utils/ui-tools/pinata-tools";
import {
  _getterFeaturesHub,
  _getterMissionsHub,
} from "utils/ui-tools/web3-tools";

export const MissionInfo = ({ missionId }) => {
  const [metadata, setMetadata] = useState(null);

  useEffect(() => {
    (async () => {
      const tokenURI = await _getterMissionsHub("tokenURI", [missionId]);
      const _metadata = await fetchJSONByCID(tokenURI);
      _metadata.features = await _getterMissionsHub("getFeaturesIndexer", [
        missionId,
      ]);
      let amount = 0;
      for (let index = 0; index < _metadata.features.length; index++) {
        const featureId = _metadata.features[index];
        const featureData = await _getterFeaturesHub("getDatas", [featureId]);
        amount += parseInt(featureData.wadge);
      }
      _metadata.owner = await _getterMissionsHub("ownerOf", [missionId]);
      _metadata.totalAmount = ethers.utils.formatEther(amount.toString());
      setMetadata(_metadata);
    })();
  }, [missionId]);

  return (
    <div className="stats shadow w-full">
      <MissionTextInfo metadata={metadata} />
      <MissionDataInfo metadata={metadata} />
      <MissionGithub metadata={metadata} />
      <MissionAmount metadata={metadata} />
    </div>
  );
};
