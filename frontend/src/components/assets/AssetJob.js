import { Icon } from "@iconify/react";
import { CVName } from "components/inputs/inputsCV/CVName";
import { MissionName } from "components/inputs/inputsMission/MissionName";
import { MyCardInfo } from "components/myComponents/card/MyCardInfo";
import { ENUMS } from "constants/enums";
import { ADDRESSES } from "constants/web3";
import { doStateTools, useToolsDispatch, useToolsState } from "context/tools";
import { useInView } from "framer-motion";
import { icfyETHER } from "icones";
import React, { useEffect, useRef, useState } from "react";
import { fetchJSONByCID } from "utils/ui-tools/pinata-tools";
import { stateCV, stateFeature } from "utils/ui-tools/state-tools";
import { _apiGet } from "utils/ui-tools/web3-tools";
import { v4 } from "uuid";

export const AssetJob = ({ feature, style, noBtn, featureID }) => {
  const ref = useRef(null);
  const ref1 = useRef(null);
  let [isFeature, setIsFeature] = useState(null);
  let { state, pointer, index } = useToolsState();
  const isInView = useInView(ref);
  const isInView1 = useInView(ref1);

  let fetchState = async () => {
    setIsFeature(await stateFeature(featureID));
  };

  useEffect(() => {
    if (isFeature === null && feature && isInView && isInView1) {
      setIsFeature(feature);
      console.log("set Asset :", pointer);
    } else if (isInView && isInView1 && !isFeature && featureID > 0) {
      fetchState();
      console.log("Asset job is In view fetch state:", pointer);
    } else if (
      feature?.featureID !== state?.features?.[index]?.featureID &&
      isInView &&
      isInView1 &&
      feature
    ) {
      setIsFeature(feature);
      console.log("set Asset 2 ...", pointer);
    }
  }, [isInView, isInView1, index, featureID]);
  return (
    <div className={style || "w-[23%]  mx-2 mb-3 h-fit " + "relative"}>
      <div className="absolute w-full top-0 py-1" ref={ref} />
      <div className="absolute w-full bottom-0 py-1" ref={ref1} />
      <MyCardInfo
        styles={"w-full h-full " + style}
        key={v4()}
        color={1}
        header={{
          icon: ENUMS.courts?.[state?.features?.[index]?.datas?.specification]
            ?.badge,
          title: state?.features?.[index]?.metadatas?.title,
          component: (
            <MissionName
              metadatas={state?.mission?.metadatas}
              id={state?.features?.[index]?.datas?.missionID}
            />
          ),
        }}
        main={{
          title: (
            <CVName
              metadata={state?.owner?.metadatas}
              cvID={state?.features?.[index]?.datas?.owner}
            />
          ),
          text: state?.features?.[index]?.metadatas?.description,
        }}
        btn={
          !noBtn
            ? {
                title: (
                  <>
                    <span className="flex items-center text-xs">
                      {state?.features?.[index]?.datas?.wadge}{" "}
                      <Icon icon={icfyETHER} className="ml-1" />
                    </span>
                    <p>Ask to join</p>
                  </>
                ),
                style: "flex items-center justify-between",
              }
            : { component: <></> }
        }
      />
    </div>
  );
};
