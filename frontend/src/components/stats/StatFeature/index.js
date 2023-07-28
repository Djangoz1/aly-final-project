import React, { useEffect, useState } from "react";
import { _setterCV } from "utils/ui-tools/web3-tools";

import { StatFeatureHeader } from "./StatFeatureHeader";
import { StatFeatureBadges } from "./StatFeatureBadges";
import { StatFeatureFooter } from "./StatFeatureFooter";

import { StatFeatureHidden } from "./StatFeatureHidden";
import { MyCard } from "components/myComponents/MyCard";
import { BtnJoinFeature } from "components/btn/BtnJoinFeature";
import { useAuthState } from "context/auth";
import { ZERO_ADDRESS } from "constants/web3";

export const StatFeature = ({ obj, feature, submit, link }) => {
  const [isClicked, setIsClicked] = useState(false);
  const { cv } = useAuthState();
  return (
    <MyCard styles={"flex-col flex"}>
      <div className="flex-col w-[360px]">
        <StatFeatureHeader feature={feature} obj={obj} />
        <div className="my-5"></div>
        <StatFeatureBadges feature={feature} />
        <StatFeatureFooter
          obj={obj}
          feature={feature}
          submit={submit}
          link={link}
        />
      </div>
      <div className="join absolute bottom-4 right-3 ml-auto">
        <button
          className="btn-info btn join-item  btn-xs   btn-outline"
          onClick={() => (isClicked ? setIsClicked(false) : setIsClicked(true))}
        >
          {isClicked ? "Close" : "details"}
        </button>
        {cv &&
          submit &&
          feature?.assignedWorker === ZERO_ADDRESS &&
          !feature?.isInviteOnly && (
            <BtnJoinFeature
              missionId={parseInt(feature?.missionID)}
              featureId={feature?.id}
              getter={submit}
            />
          )}
      </div>
      {isClicked && <StatFeatureHidden feature={feature} />}
    </MyCard>
  );
};
