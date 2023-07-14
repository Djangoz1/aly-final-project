import React, { useEffect, useState } from "react";
import { _setterCV } from "utils/ui-tools/web3-tools";

import { StatFeatureHeader } from "./StatFeatureHeader";
import { StatFeatureBadges } from "./StatFeatureBadges";
import { StatFeatureFooter } from "./StatFeatureFooter";

import { StatFeatureHidden } from "./StatFeatureHidden";

export const StatFeature = ({ obj, feature, submit, link }) => {
  const [isClicked, setIsClicked] = useState(false);

  return (
    <div
      className={`flex  border shadow bg-white/90 hover:bg-white px-4 pt-4 pb-2 box-border  rounded ${
        isClicked ? "w-[85vw]" : "w-[370px]"
      }`}
      onClick={() => (isClicked ? setIsClicked(false) : setIsClicked(true))}
    >
      <div className="flex-col w-[360px]">
        <StatFeatureHeader feature={feature} obj={obj} />
        <div className="my-5 text-black font-black"></div>
        <StatFeatureBadges feature={feature} />
        <StatFeatureFooter
          obj={obj}
          feature={feature}
          submit={submit}
          link={link}
        />
      </div>
      {isClicked && <StatFeatureHidden feature={feature} />}
    </div>
  );
};
