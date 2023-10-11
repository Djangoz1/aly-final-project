import { Icon } from "@iconify/react";
import { CVName } from "components/inputs/inputsCV/CVName";
import { MissionName } from "components/inputs/inputsMission/MissionName";
import { MyCardInfo } from "components/myComponents/card/MyCardInfo";
import { ENUMS } from "constants/enums";
import { ADDRESSES } from "constants/web3";
import { icfyETHER } from "icones";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { stateFeature } from "utils/ui-tools/state-tools";
import { _apiGet } from "utils/ui-tools/web3-tools";
import { v4 } from "uuid";

export const ListJobs = ({ bool }) => {
  let [isList, setIsList] = useState(null);
  let fetch = async () => {
    let arr = [];
    let length = parseInt(
      await _apiGet("tokensLengthOf", [ADDRESSES["featuresHub"]])
    );

    console.log(length);
    for (let index = 1; index <= length; index++) {
      const element = await stateFeature(index);
      console.log(bool(element));
      if (!bool || (bool && bool(element))) {
        arr.push(element);
      }
    }
    setIsList(arr);
  };

  useEffect(() => {
    if (!isList) {
    }
    fetch();
  }, [bool]);

  return (
    <div className="flex box-border flex-wrap">
      {isList?.map((el) => (
        <MyCardInfo
          styles={"w-1/3 mx-2 mb-3 h-fit "}
          key={v4()}
          color={1}
          header={{
            icon: ENUMS.courts?.[el?.datas?.specification]?.badge,
            title: el?.metadatas?.title,
            component: <MissionName id={el?.datas?.missionID} />,
          }}
          main={{
            title: <CVName cvID={el?.datas?.owner} />,
            text: el?.metadatas?.description,
          }}
          btn={{
            title: (
              <>
                <span className="flex items-center text-xs">
                  {el?.datas?.wadge} <Icon icon={icfyETHER} className="ml-1" />
                </span>
                <p>Ask to join</p>
              </>
            ),
            style: "flex items-center justify-between",
          }}
        />
      ))}
    </div>
  );
};
