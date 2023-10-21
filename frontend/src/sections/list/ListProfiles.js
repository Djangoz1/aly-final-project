import { Icon } from "@iconify/react";
import { AssetFreelancer, AssetProfile } from "components/assets/AssetProfile";
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
} from "utils/ui-tools/state-tools";
import { _apiGet } from "utils/ui-tools/web3-tools";
import { v4 } from "uuid";

export const ListProfiles = ({ bool }) => {
  let [isList, setIsList] = useState(null);

  console.log(isList);
  let fetch = async () => {
    let arr = [];
    let length = parseInt(
      await _apiGet("tokensLengthOf", [ADDRESSES["cvsHub"]])
    );

    for (let index = 1; index <= length; index++) {
      const element = await stateCV(index);
      element.details = await stateDetailsCV(index);
      if ((bool && bool(element)) || !bool) {
        arr.push(element);
      }
    }
    setIsList(arr);
  };

  useEffect(() => {
    fetch();
  }, [bool]);

  return (
    <div className="flex   justify-center w-fit  flex-wrap ">
      {isList?.map((el) => (
        <AssetFreelancer style={"m-2"} key={v4()} owner={el} />
      ))}
    </div>
  );
};
