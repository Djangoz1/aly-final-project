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
import React, { useState } from "react";
import { v4 } from "uuid";
import { AnimatePresence, motion } from "framer-motion";
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
import { MyBtnPost } from "components/myComponents/btn/MyBtnPost";
import Link from "next/link";
import { useAuthState } from "context/auth";
import { FeatureInformations } from "sections/works/Features/state/FeatureInformations";
import { FeatureDispute } from "sections/works/Features/state/FeatureDispute";
import { FeatureNotifications } from "sections/works/Features/state/FeatureNotifications";

export const MissionFeatures = () => {
  let { state, index } = useToolsState();
  let { cv } = useAuthState();
  let [isTabs, setIsTabs] = useState(0);

  let dispatch = useToolsDispatch();
  let handleChangeMenu = (i) => {
    setIsTabs(i);
  };

  let components = [
    <FeatureInformations />,

    <FeatureNotifications />,
    <div className=""></div>,
    state?.features?.[index]?.datas?.dispute && <FeatureDispute />,
  ];
  return (
    <>
      <div className="flex h-full  flex-col">
        <MyMenusTabs
          arr={[
            "Informations",
            "Notifications",
            "Gallery",
            state?.features?.[index]?.datas?.dispute && "Disputes",
          ]}
          value={isTabs}
          setter={handleChangeMenu}
        />
        <div className=" w-full h-full relative flex">{components[isTabs]}</div>
      </div>
    </>
  );
};
