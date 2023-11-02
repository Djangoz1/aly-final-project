import { AssetJob } from "components/assets/AssetJob";
import { AssetProfile } from "components/assets/AssetProfile";
import {
  MyCard,
  MyCard1,
  MyCardInfos,
} from "components/myComponents/card/MyCard";
import {
  doIndexTools,
  doStateMissionTools,
  useToolsDispatch,
  useToolsState,
} from "context/tools";
import React, { useEffect, useRef, useState } from "react";
import { v4 } from "uuid";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { MyOverlay } from "components/myComponents/MyOverlay";
import { MyMenusTabs } from "components/myComponents/menu/MyMenus";
import { _apiPost } from "utils/ui-tools/web3-tools";
import { STATUS } from "constants/status";
import { Icon } from "@iconify/react";
import { fromTimestamp } from "utils/ux-tools";
import { icfy, icfyETHER } from "icones";
import { parseTimestamp } from "helpers";
import { ENUMS } from "constants/enums";
import { MyCardInfo } from "components/myComponents/card/MyCardInfo";
import { MyBtnPost } from "components/btn/MyBtnPost";
import Link from "next/link";
import { useAuthState } from "context/auth";
import { FeatureInformations } from "sections/works/Features/state/FeatureInformations";
import { FeatureDispute } from "sections/works/Features/state/FeatureDispute";
import { FeatureNotifications } from "sections/works/Features/state/FeatureNotifications";
import { stateFeature, stateMission } from "utils/ui-tools/state-tools";
import { MissionMenusDropdown } from "./MissionMenusDropdown";

export const MissionFeatures = ({ featureID, index }) => {
  let ref = useRef(null);
  let { state } = useToolsState();
  let { cv } = useAuthState();
  let [isTabs, setIsTabs] = useState(0);
  let [isState, setIsState] = useState({
    feature: null,
  });
  let isInView = useInView(ref);
  let fetch = async () => {
    setIsState({
      feature: await stateFeature(featureID),
    });
  };
  useEffect(() => {
    if (isInView && featureID && isState?.feature?.featureID != featureID) {
      fetch();
    }
  }, [isInView, featureID]);

  useEffect(() => {
    if (!featureID && state?.front?.props[0]) {
      setIsState({ feature: state?.features?.[index] });
    }
  }, [index]);

  let handleChangeMenu = (i) => {
    setIsTabs(i);
  };

  console.log("ok", isState);
  console.log("index", index);
  let components = [
    <FeatureInformations feature={isState?.feature} />,

    <FeatureNotifications feature={isState?.feature} />,
    <AssetJob
      style={" w-full rounded-t-none "}
      noBtn={true}
      feature={isState?.feature}
      featureID={isState?.feature}
    />,

    isState?.feature?.datas?.dispute && (
      <FeatureDispute disputeID={isState?.feature?.datas?.dispute} />
    ),
  ];
  return (
    <>
      <div ref={ref} className="flex h-full w-full  ">
        <div className=" overflow-y-scroll w-1/5 backdrop-blur-[1px]">
          <MissionMenusDropdown />
        </div>
        <div className="flex flex-col w-full">
          <MyMenusTabs
            template={2}
            color={1}
            style={"  bgprim w-full justify-end p-2 mb-[1px] "}
            styleOrigin={"ml-auto"}
            arr={[
              "Informations",
              "Notifications",
              "Description",
              "Gallery",
              state?.features?.[index]?.datas?.dispute && "Disputes",
            ]}
            value={isTabs}
            setter={handleChangeMenu}
          />
          <div className=" w-full h-full relative flex">
            {components[isTabs]}
          </div>
        </div>
      </div>
    </>
  );
};
