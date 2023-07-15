import { MissionAmount } from "components/Mission/MissionAmount";
import { MissionTextInfo } from "components/Mission/MissionTextInfo";
import { MissionDataInfo } from "components/Feature/MissionDataInfo";
import { MissionGithub } from "components/Mission/MissionGithub";

import React, { useEffect, useState } from "react";

import {
  _getterFeaturesHub,
  _getterMissionsHub,
} from "utils/ui-tools/web3-tools";
import { _getMissionInfoState } from "utils/ui-tools/mission-tools";

export const MissionInfo = ({ missionId }) => {
  const [metadata, setMetadata] = useState(null);

  useEffect(() => {
    (async () => {
      const _metadata = await _getMissionInfoState(missionId);
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
