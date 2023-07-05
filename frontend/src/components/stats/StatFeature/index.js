import React, { useState } from "react";
import { _setterCV } from "utils/ui-tools/web3-tools";
import { recastDescription } from "utils/ux-tools";
import { StatFeatureHeader } from "./StatFeatureHeader";
import { StatFeatureBadges } from "./StatFeatureBadges";
import { StatFeatureFooter } from "./StatFeatureFooter";

import { StatFeatureHidden } from "./StatFeatureHidden";
import { useAuthState } from "context/auth";

export const StatFeature = ({ feature, mission, submit, link }) => {
  const [isClicked, setIsClicked] = useState(false);
  const { cv } = useAuthState();
  return (
    <div
      className={`flex  border shadow bg-white/90 hover:bg-white px-4 pt-4 pb-2 box-border  rounded ${
        isClicked ? "w-[85vw]" : "w-[370px]"
      }`}
      onClick={() => (isClicked ? setIsClicked(false) : setIsClicked(true))}
    >
      <div className="flex-col w-[360px]">
        <StatFeatureHeader feature={feature} mission={mission} />
        <p className="my-5 text-black font-black">
          {recastDescription(feature?.description)?.title}
        </p>
        <StatFeatureBadges feature={feature} />
        <StatFeatureFooter
          feature={feature}
          mission={mission}
          submit={submit}
          link={link}
        />
      </div>
      {isClicked && <StatFeatureHidden feature={feature} mission={mission} />}
    </div>
  );
};
