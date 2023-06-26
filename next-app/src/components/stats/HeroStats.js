import { useAuthState } from "context/auth";
import { parseHex } from "helpers";
import React, { useEffect, useState } from "react";
import { _getCVsLength } from "utils/ui-tools/auth-tools";
import { _getMissionsLength } from "utils/ui-tools/mission-tools";

export const HeroStats = ({ statistics }) => {
  const { factoryCv } = useAuthState();
  const [cvLength, setCvLength] = useState(null);
  const [missionLength, setMissionLength] = useState(null);
  useEffect(() => {
    if (factoryCv && !cvLength) {
      getCvLength();
    }
    if (factoryCv && !missionLength) {
      getMissionLength();
    }
  }, [factoryCv]);
  const getCvLength = async () => {
    const length = await _getCVsLength();
    const result = parseHex(length);
    setCvLength(result);
  };

  const getMissionLength = async () => {
    const length = await _getMissionsLength();
    const result = parseHex(length);
    setMissionLength(result);
  };

  const statsNumber = [missionLength, 100, cvLength, "1000 USDT"];
  return (
    <div className="w-[21vw] h-fit flex flex-wrap">
      {statistics?.map((stat, index) => (
        <div
          key={stat.title}
          className="w-[10vw] h-[10vh] flex flex-col bg-zinc-800 rounded shadow shadow-2xl m-1 items-center justify-center"
        >
          <span className="text-white text-2xl">{statsNumber[index]}</span>
          <p>{stat.title}</p>
        </div>
      ))}
    </div>
  );
};
