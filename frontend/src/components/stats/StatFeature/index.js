import React, { useEffect, useState } from "react";
import { _setterCV } from "utils/ui-tools/web3-tools";
import { recastDescription } from "utils/ux-tools";
import { StatFeatureHeader } from "./StatFeatureHeader";
import { StatFeatureBadges } from "./StatFeatureBadges";
import { StatFeatureFooter } from "./StatFeatureFooter";

import { StatFeatureHidden } from "./StatFeatureHidden";
import { useAuthState } from "context/auth";
import { fetchJSONByCID } from "utils/ui-tools/pinata-tools";

export const StatFeature = ({ obj, feature, mission, submit, link }) => {
  const [isClicked, setIsClicked] = useState(false);
  const { cv } = useAuthState();

  const [metadata, setMetadata] = useState(null);

  useEffect(() => {
    if (!metadata) {
      (async () => {
        const res = await fetchJSONByCID(feature?.tokenURI);
        setMetadata(res);
      })();
    }
  }, [feature]);
  return (
    <div
      className={`flex  border shadow bg-white/90 hover:bg-white px-4 pt-4 pb-2 box-border  rounded ${
        isClicked ? "w-[85vw]" : "w-[370px]"
      }`}
      onClick={() => (isClicked ? setIsClicked(false) : setIsClicked(true))}
    >
      <div className="flex-col w-[360px]">
        <StatFeatureHeader feature={feature} obj={obj} metadata={metadata} />
        <p className="my-5 text-black font-black">
          {recastDescription(feature?.description)?.title}
        </p>
        <StatFeatureBadges feature={feature} metadata={metadata} />
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
