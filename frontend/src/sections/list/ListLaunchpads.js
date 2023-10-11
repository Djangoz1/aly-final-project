import { Icon } from "@iconify/react";
import { LaunchpadCard } from "components/assets/AssetLaunchpad";
import { AssetLaunchpad } from "components/assets/AssetLaunchpad";
import { AssetProfile } from "components/assets/AssetProfile";
import { CVName } from "components/inputs/inputsCV/CVName";
import { MissionName } from "components/inputs/inputsMission/MissionName";
import {
  BtnGb1,
  BtnGb2,
  BtnGr1,
} from "components/myComponents/btn/MyGradientButton";
import { MyCardInfo } from "components/myComponents/card/MyCardInfo";
import { Avatar, ProfileAvatar } from "components/profile/ProfileAvatar";
import { ENUMS } from "constants/enums";

import { ADDRESSES } from "constants/web3";
import { icfy, icfyETHER } from "icones";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import {
  stateCV,
  stateDetailsCV,
  stateFeature,
  stateLaunchpad,
} from "utils/ui-tools/state-tools";
import { _apiGet } from "utils/ui-tools/web3-tools";
import { v4 } from "uuid";

export const ListLaunchpads = () => {
  let [isList, setIsList] = useState(null);
  let fetch = async () => {
    let arr = [];
    let length = parseInt(
      await _apiGet("tokensLengthOf", [ADDRESSES["launchpadHub"]])
    );

    for (let index = 1; index <= length; index++) {
      const element = await stateLaunchpad(index);

      arr.push(element);
    }
    setIsList(arr);
  };

  useEffect(() => {
    if (!isList) {
      fetch();
    }
  }, []);

  return (
    <div className="flex flex-wrap">
      {isList?.map((el) => (
        <AssetLaunchpad
          id={1}
          state={el}
          style={"w-[31%] mx-2 mb-3 h-fit "}
          key={v4()}
          color={2}
        />
      ))}
    </div>
  );
};
